interface Point {
  x: number;
  y: number;
}

interface GNode {
  id: number;
  type?: "isAvailable" | "isLoading";
  x: number;
  y: number;
  minimized: boolean;
  isRoot?: boolean;
}

class BinaryTree {
  private root: GNode | undefined;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nodeRadius = 20;
  private levelTree: number = 0;
  private levelGap = 90;
  private verticalGap = 60;
  private scale = 1;
  private translate: Point = { x: 0, y: 0 };
  child: { [index: GNode["id"]]: GNode };

  constructor(
    private centerX: number,
    private centerY: number,
    private me: GNode["id"],
    canvas: HTMLCanvasElement
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.centerX = centerX;
    this.centerY = centerY;
  }

  addNode(id: number, type?: "isAvailable" | "isLoading"): void {
    const newNode: GNode = {
      id,
      type,
      x: this.centerX,
      y: this.centerY,
      minimized: false,
      isRoot: false,
    };

    if (!this.root) {
      this.root = { ...newNode, isRoot: true };
      this.child = {};
      this.addNode(2 * id + 1);
      this.addNode(2 * id + 2);
      return;
    }

    const parentId = BinaryTree.parentNodeId(id);
    let isParent = !!this.child[parentId];
    if (!isParent) {
      if (this.root.id === parentId) {
        isParent = true;
      }
    }

    if (!isParent) {
      return;
    }
    const current = this.child[id];
    if (!current) {
      this.child[id] = newNode;
      this.levelTree =
        this.nodeLevel(id) < this.levelTree
          ? this.levelTree
          : this.nodeLevel(id);
      this.updateTreeLayout();
      return;
    } else {
      current.type = type;
    }
  }

  nodeParent(id: number): GNode | undefined {
    const nodeLeftid = 2 * id + 1;
    return this.child[nodeLeftid];
  }
  nodeLevel(id: number): number {
    return Math.floor(Math.log2(id + 1)) + 1;
  }

  nodeRight(id: number): GNode | undefined {
    const nodeId = 2 * id + 2;
    return this.child[nodeId];
  }
  nodeLeft(id: number): GNode | undefined {
    const nodeId = 2 * id + 1;
    return this.child[nodeId];
  }
  static parentNodeId(id: number) {
    if (BinaryTree.isNodeRight(id)) {
      return (id - 2) / 2;
    } else {
      return (id - 1) / 2;
    }
  }

  updateTreeLayout(): void {
    if (!this.root) {
      return;
    }

    const calcNodePositions = (
      node: GNode,
      x: number,
      y: number,
      level: number,
      maxDepth: number,
      maxNodes: number
    ): void => {
      if (node.minimized) {
        return;
      }
      //   console.log("d", node, x, y, level);

      node.x = x;
      node.y = y;

      const nodeLeft = this.nodeLeft(node.id);
      if (nodeLeft) {
        console.log("maxNodesmaxNodes", maxNodes);
        const leftX = x - maxNodes * this.nodeRadius;
        const leftY = y + this.nodeRadius + (maxDepth * this.nodeRadius) / 4;
        calcNodePositions(
          nodeLeft,
          leftX,
          leftY,
          level + 1,
          maxDepth - 1,
          maxNodes / 2
        );
      }

      const nodeRight = this.nodeRight(node.id);
      if (nodeRight) {
        const rightX = x + maxNodes * this.nodeRadius;
        const rightY = y + this.nodeRadius + (maxDepth * this.nodeRadius) / 4;
        calcNodePositions(
          nodeRight,
          rightX,
          rightY,
          level + 1,
          maxDepth - 1,
          maxNodes / 2
        );
      }
    };

    calcNodePositions(
      this.root,
      this.centerX,
      this.centerY,
      1,
      this.levelTree,
      Math.pow(2, this.levelTree + 1) / 2
    );
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawTree();
  }
  drawTree(
    node = this.root,
    startX = this.centerX,
    startY = this.centerY
  ): void {
    if (!node) {
      return;
    }
    this.drawNode(node);
    const nodeLeft = this.nodeLeft(node.id);
    if (nodeLeft) {
      this.drawLine(startX, startY, nodeLeft.x, nodeLeft.y);
      this.drawTree(nodeLeft, nodeLeft.x, nodeLeft.y);
    }

    const nodeRight = this.nodeRight(node.id);
    if (nodeRight) {
      this.drawLine(startX, startY, nodeRight.x, nodeRight.y);
      this.drawTree(nodeRight, nodeRight.x, nodeRight.y);
    }
  }
  drawNode(node: GNode): void {
    const isMinimized = node.minimized;
    const { x, y } = node;
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
  }

  drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
    this.ctx.closePath();
  }

  findNode(event: MouseEvent): GNode | undefined {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - this.translate.x;
    const y = event.clientY - rect.top - this.translate.y;

    const searchNode = (node: GNode | undefined): GNode | undefined => {
      if (!node) {
        return undefined;
      }
      const nodeLeft = this.nodeLeft(node.id);
      const nodeRight = this.nodeRight(node.id);

      const dx = node.x - x;
      const dy = node.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= this.nodeRadius) {
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
  }

  toggleMinimize(node: GNode): void {
    node.minimized = !node.minimized;
    this.updateTreeLayout();
    this.draw();
  }

  zoomIn(): void {
    console.log("zoomIn");
    this.scale++;
    this.updateTreeLayout();
    this.draw();
  }

  zoomOut(): void {
    console.log("zoomOut");
    if (this.scale === 1) {
      return;
    }
    this.scale--;
    this.updateTreeLayout();
    this.draw();
  }
  pan(dx: number, dy: number): void {
    this.translate.x += dx;
    this.translate.y += dy;
    this.draw();
  }

  init(onClickNode: (node: GNode) => void): void {
    this.updateTreeLayout();
    this.draw();

    this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
      const node = this.findNode(event);

      if (node) {
        onClickNode(node);
        // this.toggleMinimize(node);
      } else {
        let startX = event.clientX - this.translate.x;
        let startY = event.clientY - this.translate.y;

        const mouseMoveHandler = (moveEvent: MouseEvent): void => {
          const dx = moveEvent.clientX - this.translate.x - startX;
          const dy = moveEvent.clientY - this.translate.y - startY;
          this.pan(dx, dy);
          startX += dx;
          startY += dy;
        };

        const mouseUpHandler = (): void => {
          this.canvas.removeEventListener("mousemove", mouseMoveHandler);
          this.canvas.removeEventListener("mouseup", mouseUpHandler);
        };

        this.canvas.addEventListener("mousemove", mouseMoveHandler);
        this.canvas.addEventListener("mouseup", mouseUpHandler);
      }
    });

    this.canvas.addEventListener("wheel", (event: WheelEvent) => {
      event.preventDefault();
      const zoomIn = event.deltaY < 0;
      zoomIn ? this.zoomIn() : this.zoomOut();
    });
  }

  static isNodeRight(id: number) {
    return id % 2 === 0;
  }
}
