interface Point {
  x: number;
  y: number;
}

interface GNode {
  id: number;
  left?: GNode;
  right?: GNode;
  x: number;
  y: number;
  minimized: boolean;
}

class BinaryTree {
  private root: GNode | undefined;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nodeRadius = 20;
  private levelGap = 60;
  private verticalGap = 60;
  private scale = 1;
  private translate: Point = { x: 0, y: 0 };

  constructor(
    private centerX: number,
    private centerY: number,
    canvas: HTMLCanvasElement
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

  addNode(id: number): void {
    const newNode: GNode = {
      id,
      x: this.centerX,
      y: this.centerY,
      minimized: false,
    };

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    let parent: GNode;

    while (current) {
      parent = current;

      if (id < current.id) {
        current = current.left;
        if (!current) {
          parent.left = newNode;
          this.updateTreeLayout();
          return;
        }
      } else {
        current = current.right;
        if (!current) {
          parent.right = newNode;
          this.updateTreeLayout();
          return;
        }
      }
    }
  }

  updateTreeLayout(): void {
    if (!this.root) {
      return;
    }

    const calcNodePositions = (node: GNode, x: number, y: number): void => {
      if (node.minimized) {
        return;
      }

      node.x = x;
      node.y = y;

      if (node.left) {
        const leftX = x - this.levelGap / Math.pow(2, this.scale);
        const leftY = y + this.verticalGap;
        calcNodePositions(node.left, leftX, leftY);
      }

      if (node.right) {
        const rightX = x + this.levelGap / Math.pow(2, this.scale);
        const rightY = y + this.verticalGap;
        calcNodePositions(node.right, rightX, rightY);
      }
    };

    calcNodePositions(this.root, this.centerX, this.centerY);
  }

  drawNode(node: GNode): void {
    const isMinimized = node.minimized;
    const { x, y } = node;
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

  drawTree(node?: GNode, startX = this.centerX, startY = this.centerY): void {
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
  }
  findNode(event: MouseEvent): GNode | undefined {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - this.translate.x;
    const y = event.clientY - rect.top - this.translate.y;
    const searchNode = (node: GNode | undefined): GNode | undefined => {
      if (!node) {
        return undefined;
      }

      const dx = node.x - x;
      const dy = node.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= this.nodeRadius) {
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
  }

  toggleMinimize(node: GNode): void {
    node.minimized = !node.minimized;
    this.updateTreeLayout();
    this.draw();
  }

  zoomIn(): void {
    this.scale++;
    this.updateTreeLayout();
    this.draw();
  }

  zoomOut(): void {
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

  draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawTree();
  }

  init(): void {
    this.updateTreeLayout();
    this.draw();

    this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
      const node = this.findNode(event);

      if (node) {
        this.toggleMinimize(node);
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
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
const centerX = canvas.width / 2;
const centerY = 50;

const binaryTree = new BinaryTree(centerX, centerY, canvas);
binaryTree.addNode(4);
binaryTree.init();
