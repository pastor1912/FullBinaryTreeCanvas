var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var BinaryTree = /** @class */ (function () {
    function BinaryTree(centerX, centerY, me, canvas) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.me = me;
        this.nodeRadius = 20;
        this.levelTree = 0;
        this.levelGap = 90;
        this.verticalGap = 60;
        this.scale = 1;
        this.translate = { x: 0, y: 0 };
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.centerX = centerX;
        this.centerY = centerY;
    }
    BinaryTree.prototype.addNode = function (id, type) {
        var newNode = {
            id: id,
            type: type,
            x: this.centerX,
            y: this.centerY,
            minimized: false,
            isRoot: false,
        };
        if (!this.root) {
            this.root = __assign(__assign({}, newNode), { isRoot: true });
            this.child = {};
            this.addNode(2 * id + 1);
            this.addNode(2 * id + 2);
            return;
        }
        var parentId = BinaryTree.parentNodeId(id);
        var isParent = !!this.child[parentId];
        if (!isParent) {
            if (this.root.id === parentId) {
                isParent = true;
            }
        }
        if (!isParent) {
            return;
        }
        var current = this.child[id];
        if (!current) {
            this.child[id] = newNode;
            this.levelTree =
                this.nodeLevel(id) < this.levelTree
                    ? this.levelTree
                    : this.nodeLevel(id);
            this.updateTreeLayout();
            return;
        }
        else {
            current.type = type;
        }
    };
    BinaryTree.prototype.nodeParent = function (id) {
        var nodeLeftid = 2 * id + 1;
        return this.child[nodeLeftid];
    };
    BinaryTree.prototype.nodeLevel = function (id) {
        return Math.floor(Math.log2(id + 1)) + 1;
    };
    BinaryTree.prototype.nodeRight = function (id) {
        var nodeId = 2 * id + 2;
        return this.child[nodeId];
    };
    BinaryTree.prototype.nodeLeft = function (id) {
        var nodeId = 2 * id + 1;
        return this.child[nodeId];
    };
    BinaryTree.parentNodeId = function (id) {
        if (BinaryTree.isNodeRight(id)) {
            return (id - 2) / 2;
        }
        else {
            return (id - 1) / 2;
        }
    };
    BinaryTree.prototype.updateTreeLayout = function () {
        var _this = this;
        if (!this.root) {
            return;
        }
        var calcNodePositions = function (node, x, y, level, maxDepth, maxNodes) {
            if (node.minimized) {
                return;
            }
            //   console.log("d", node, x, y, level);
            node.x = x;
            node.y = y;
            var nodeLeft = _this.nodeLeft(node.id);
            if (nodeLeft) {
                console.log("maxNodesmaxNodes", maxNodes);
                var leftX = x - maxNodes * _this.nodeRadius;
                var leftY = y + _this.nodeRadius + (maxDepth * _this.nodeRadius) / 4;
                calcNodePositions(nodeLeft, leftX, leftY, level + 1, maxDepth - 1, maxNodes / 2);
            }
            var nodeRight = _this.nodeRight(node.id);
            if (nodeRight) {
                var rightX = x + maxNodes * _this.nodeRadius;
                var rightY = y + _this.nodeRadius + (maxDepth * _this.nodeRadius) / 4;
                calcNodePositions(nodeRight, rightX, rightY, level + 1, maxDepth - 1, maxNodes / 2);
            }
        };
        calcNodePositions(this.root, this.centerX, this.centerY, 1, this.levelTree, Math.pow(2, this.levelTree + 1) / 2);
    };
    BinaryTree.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTree();
    };
    BinaryTree.prototype.drawTree = function (node, startX, startY) {
        if (node === void 0) { node = this.root; }
        if (startX === void 0) { startX = this.centerX; }
        if (startY === void 0) { startY = this.centerY; }
        if (!node) {
            return;
        }
        this.drawNode(node);
        var nodeLeft = this.nodeLeft(node.id);
        if (nodeLeft) {
            this.drawLine(startX, startY, nodeLeft.x, nodeLeft.y);
            this.drawTree(nodeLeft, nodeLeft.x, nodeLeft.y);
        }
        var nodeRight = this.nodeRight(node.id);
        if (nodeRight) {
            this.drawLine(startX, startY, nodeRight.x, nodeRight.y);
            this.drawTree(nodeRight, nodeRight.x, nodeRight.y);
        }
    };
    BinaryTree.prototype.drawNode = function (node) {
        var isMinimized = node.minimized;
        var x = node.x, y = node.y;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.nodeRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = isMinimized ? "gray" : "#FFCA28";
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
            this.ctx.fillText(node.id.toString(), x, y);
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
    BinaryTree.prototype.findNode = function (event) {
        var _this = this;
        var rect = this.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left - this.translate.x;
        var y = event.clientY - rect.top - this.translate.y;
        var searchNode = function (node) {
            if (!node) {
                return undefined;
            }
            var nodeLeft = _this.nodeLeft(node.id);
            var nodeRight = _this.nodeRight(node.id);
            var dx = node.x - x;
            var dy = node.y - y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= _this.nodeRadius) {
                return node;
            }
            if (x < node.x && nodeLeft) {
                return searchNode(nodeLeft);
            }
            if (x > node.x && nodeRight) {
                return searchNode(nodeRight);
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
        console.log("zoomIn");
        this.scale++;
        this.updateTreeLayout();
        this.draw();
    };
    BinaryTree.prototype.zoomOut = function () {
        console.log("zoomOut");
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
    BinaryTree.prototype.init = function (onClickNode) {
        var _this = this;
        this.updateTreeLayout();
        this.draw();
        this.canvas.addEventListener("mousedown", function (event) {
            var node = _this.findNode(event);
            if (node) {
                onClickNode(node);
                // this.toggleMinimize(node);
            }
            else {
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
    BinaryTree.isNodeRight = function (id) {
        return id % 2 === 0;
    };
    return BinaryTree;
}());
