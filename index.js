var BinaryTree = /** @class */ (function () {
  function BinaryTree(centerX, centerY, canvas) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.nodeRadius = 20;
    this.levelGap = 60;
    this.verticalGap = 60;
    this.scale = 1;
    this.translate = { x: 0, y: 0 };
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }
  BinaryTree.prototype.addNode = function (val) {
    var newNode = {
      val: val,
      x: this.centerX,
      y: this.centerY,
      minimized: false,
    };
    if (!this.root) {
      this.root = newNode;
      return;
    }
    var currentNode = this.root;
    var parentNode;
    while (currentNode) {
      parentNode = currentNode;
      if (val < currentNode.val) {
        currentNode = currentNode.left;
        if (!currentNode) {
          parentNode.left = newNode;
          this.updateTreeLayout();
          return;
        }
      } else {
        currentNode = currentNode.right;
        if (!currentNode) {
          parentNode.right = newNode;
          this.updateTreeLayout();
          return;
        }
      }
    }
  };
  BinaryTree.prototype.updateTreeLayout = function () {
    var _this = this;
    if (!this.root) {
      return;
    }
    var calcNodePositions = function (node, x, y) {
      if (node.minimized) {
        return;
      }
      node.x = x;
      node.y = y;
      if (node.left) {
        var leftX = x - _this.levelGap / Math.pow(2, _this.scale);
        var leftY = y + _this.verticalGap;
        calcNodePositions(node.left, leftX, leftY);
      }
      if (node.right) {
        var rightX = x + _this.levelGap / Math.pow(2, _this.scale);
        var rightY = y + _this.verticalGap;
        calcNodePositions(node.right, rightX, rightY);
      }
    };
    calcNodePositions(this.root, this.centerX, this.centerY);
  };
  BinaryTree.prototype.drawNode = function (node) {
    var isMinimized = node.minimized;
    var x = node.x,
      y = node.y;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.nodeRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = isMinimized ? "gray" : "white";
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
    this.ctx.closePath();
    if (!isMinimized) {
      this.ctx.font = "20px Arial";
      this.ctx.fillStyle = "black";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(node.val.toString(), x, y);
    }
  };
  BinaryTree.prototype.drawLine = function (x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
    this.ctx.closePath();
  };
  BinaryTree.prototype.drawTree = function (node, startX, startY) {
    if (startX === void 0) {
      startX = this.centerX;
    }
    if (startY === void 0) {
      startY = this.centerY;
    }
    if (!node) {
      return;
    }
    this.drawNode(node);
    if (node.left) {
      this.drawLine(startX, startY, node.left.x, node.left.y);
      this.drawTree(node.left, node.left.x, node.left.y);
    }
    if (node.right) {
      this.drawLine(startX, startY, node.right.x, node.right.y);
      this.drawTree(node.right, node.right.x, node.right.y);
    }
  };
  BinaryTree.prototype.findNode = function (event) {
    var _this = this;
    var rect = this.canvas.getBoundingClientRect();
    var x = event.clientX - rect.left - this.translate.x;
    var y = event.clientY - rect.top - this.translate.y;
    var searchNode = function (node) {
      if (!node) {
        return undefined;
      }
      var dx = node.x - x;
      var dy = node.y - y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= _this.nodeRadius) {
        return node;
      }
      if (x < node.x && node.left) {
        return searchNode(node.left);
      }
      if (x > node.x && node.right) {
        return searchNode(node.right);
      }
      return undefined;
    };
    return searchNode(this.root);
  };
  BinaryTree.prototype.toggleMinimize = function (node) {
    node.minimized = !node.minimized;
    this.updateTreeLayout();
    this.draw();
  };
  BinaryTree.prototype.zoomIn = function () {
    this.scale++;
    this.updateTreeLayout();
    this.draw();
  };
  BinaryTree.prototype.zoomOut = function () {
    if (this.scale === 1) {
      return;
    }
    this.scale--;
    this.updateTreeLayout();
    this.draw();
  };
  BinaryTree.prototype.pan = function (dx, dy) {
    this.translate.x += dx;
    this.translate.y += dy;
    this.draw();
  };
  BinaryTree.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawTree();
  };
  BinaryTree.prototype.init = function () {
    var _this = this;
    this.updateTreeLayout();
    this.draw();
    this.canvas.addEventListener("mousedown", function (event) {
      var node = _this.findNode(event);
      if (node) {
        _this.toggleMinimize(node);
      } else {
        var startX_1 = event.clientX - _this.translate.x;
        var startY_1 = event.clientY - _this.translate.y;
        var mouseMoveHandler_1 = function (moveEvent) {
          var dx = moveEvent.clientX - _this.translate.x - startX_1;
          var dy = moveEvent.clientY - _this.translate.y - startY_1;
          _this.pan(dx, dy);
          startX_1 += dx;
          startY_1 += dy;
        };
        var mouseUpHandler_1 = function () {
          _this.canvas.removeEventListener("mousemove", mouseMoveHandler_1);
          _this.canvas.removeEventListener("mouseup", mouseUpHandler_1);
        };
        _this.canvas.addEventListener("mousemove", mouseMoveHandler_1);
        _this.canvas.addEventListener("mouseup", mouseUpHandler_1);
      }
    });
    this.canvas.addEventListener("wheel", function (event) {
      event.preventDefault();
      var zoomIn = event.deltaY < 0;
      zoomIn ? _this.zoomIn() : _this.zoomOut();
    });
  };
  return BinaryTree;
})();
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth / 2 - 20;
canvas.height = window.innerHeight / 2 - 20;
var centerX = canvas.width / 2;
var centerY = 50;
var binaryTree = new BinaryTree(centerX, centerY, canvas);
binaryTree.addNode(1);
