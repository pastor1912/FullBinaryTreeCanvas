interface Pointz {
  x: number;
  y: number;
}

export interface style {
  image: {
    isAvaliable: HTMLImageElement;
    isLoading: HTMLImageElement;
    default: HTMLImageElement;
  };
  color?: {
    isAvaliable?: string;
    isLoading?: string;
    isMinimized?: string;
    default?: string;
    isMe?: string;
    text?: string;
    textBg?: string;
    line?: string;
  };
  size?: {
    border?: number;
    borderMe?: number;
  };
}

export interface GNode {
  id: number;
  type?: "isAvailable" | "isLoading";
  x: number;
  y: number;
  minimized: boolean;
  isRoot?: boolean;
  style?: style;
}
export type defaultNode = Omit<GNode, "id" | "x" | "y" | "isRoot">;

export const svgUrl = (
  svg: string,
  width: number,
  height: number,
  viewBox: string
) => {
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgElement.setAttribute("width", `${width}em`);
  svgElement.setAttribute("height", `${height}em`);
  svgElement.setAttribute("viewBox", viewBox);
  svgElement.setAttribute("xml:space", "preserve");
  svgElement.innerHTML = svg;

  // convert to a valid XML source
  const as_text = new XMLSerializer().serializeToString(svgElement);

  const blob = new Blob([as_text], { type: "image/svg+xml" });

  const url = URL.createObjectURL(blob);

  return url;
};

const svgIsAvailable = (color: string) => `
  <script xmlns=""></script>
  <style type="text/css">
    .st0{fill:${color};}
  </style>
  <g>
    <path class="st0" d="M458.159,404.216c-18.93-33.65-49.934-71.764-100.409-93.431c-28.868,20.196-63.938,32.087-101.745,32.087   c-37.828,0-72.898-11.89-101.767-32.087c-50.474,21.667-81.479,59.782-100.398,93.431C28.731,448.848,48.417,512,91.842,512   c43.426,0,164.164,0,164.164,0s120.726,0,164.153,0C463.583,512,483.269,448.848,458.159,404.216z"/>
    <path class="st0" d="M256.005,300.641c74.144,0,134.231-60.108,134.231-134.242v-32.158C390.236,60.108,330.149,0,256.005,0   c-74.155,0-134.252,60.108-134.252,134.242V166.4C121.753,240.533,181.851,300.641,256.005,300.641z"/>
  </g>
`;
const svgIsloading = (color: string) => `
<script xmlns=""/><path id="primary" d="M12,21V18m6.36.36-2.12-2.12M21,12H18m.36-6.36L16.24,7.76M12,3V6M5.64,5.64,7.76,7.76M4,12H6m1,4.95.71-.71" style="stroke: ${color}; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"/>
`;
const svgDefault = (color: string) => `
<script xmlns=""/>
<style type="text/css">
	.st0{fill:${color};}
</style>
<g>
	<path class="st0" d="M458.159,404.216c-18.93-33.65-49.934-71.764-100.409-93.431c-28.868,20.196-63.938,32.087-101.745,32.087   c-37.828,0-72.898-11.89-101.767-32.087c-50.474,21.667-81.479,59.782-100.398,93.431C28.731,448.848,48.417,512,91.842,512   c43.426,0,164.164,0,164.164,0s120.726,0,164.153,0C463.583,512,483.269,448.848,458.159,404.216z"/>
	<path class="st0" d="M256.005,300.641c74.144,0,134.231-60.108,134.231-134.242v-32.158C390.236,60.108,330.149,0,256.005,0   c-74.155,0-134.252,60.108-134.252,134.242V166.4C121.753,240.533,181.851,300.641,256.005,300.641z"/>
</g>
`;

export const createImage = (src: string) => {
  const image = new Image();
  image.src = src;
  return image;
};
export function shadeColor(color: string, percent: number) {
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt(((R * (100 + percent)) / 100).toString());
  G = parseInt(((G * (100 + percent)) / 100).toString());
  B = parseInt(((B * (100 + percent)) / 100).toString());

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

export class BinaryTree {
  private root: GNode | undefined;
  private prevRoot: GNode | undefined;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nodeRadius = 30;
  private levelTree: number = 0;
  private scale = 1;
  private translate: Pointz = { x: 0, y: 0 };
  me?: GNode["id"];
  child?: { [index: GNode["id"]]: GNode };
  defaultNode: defaultNode;
  constructor(
    canvas: HTMLCanvasElement,
    private centerX: number,
    private centerY: number,
    defaultNode?: defaultNode,
    child?: { [index: GNode["id"]]: GNode }
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.centerX = centerX;
    this.centerY = centerY;
    if (child) this.child = child;

    const treeNode = {
      minimized: defaultNode?.minimized || true,
      style: {
        image: {
          isAvaliable:
            defaultNode?.style?.image ||
            createImage(svgUrl(svgIsAvailable("#fff"), 1, 1, "0 0 512 512")),
          isLoading:
            defaultNode?.style?.image ||
            createImage(svgUrl(svgIsloading("#fff"), 1, 1, "0 0 24 24")),
          default:
            defaultNode?.style?.image ||
            createImage(svgUrl(svgIsAvailable("#fff"), 1, 1, "0 0 512 512")),
        },

        color: {
          isAvaliable: defaultNode?.style?.color?.isAvaliable || "#3c6",
          isLoading: defaultNode?.style?.color?.isLoading || "#c2c2c2",
          isMinimized: defaultNode?.style?.color?.isMinimized || "#eee",
          default: defaultNode?.style?.color?.default || "#daa520",
          isMe: defaultNode?.style?.color?.isMe || "#0971fe",
          text: defaultNode?.style?.color?.isMe || "#fff",
          textBg: defaultNode?.style?.color?.isMe || "#0040ff",
          line: defaultNode?.style?.color?.line || "#fff",
        },
        size: {
          border: defaultNode?.style?.size?.border || 1,
          borderMe: defaultNode?.style?.size?.borderMe || 2,
        },
      },
    } as defaultNode;

    this.defaultNode = treeNode;
  }

  changeRoot(id: number) {
    this.prevRoot = this.root;
    this.root = undefined;
    this.addNode(id);
  }

  addNode(
    id: number,
    type?: "isAvailable" | "isLoading",
    defaultNode?: defaultNode
  ): boolean {
    const newNode: GNode = {
      id,
      type: type,
      x: this.centerX,
      y: this.centerY,
      minimized: defaultNode?.minimized || false,
      isRoot: false,
      style: defaultNode?.style,
    };

    if (!this.root) {
      this.root = { ...newNode, isRoot: true };
      this.child = this.child || {};
      return true;
    }

    const parentId = BinaryTree.parentNodeId(id);

    let isParent =
      !!this.child[parentId] ||
      this.root.id === id ||
      this.root.id === parentId;

    if (!isParent) {
      return false;
    }

    const current =
      this.child[id] || (id === this.root.id ? this.root : undefined);
    if (!current) {
      this.child[id] = newNode;
      this.levelTree =
        this.nodeLevel(id) < this.levelTree
          ? this.levelTree
          : this.nodeLevel(id);
      this.updateTreeLayout();
    } else {
      current.type = type;
      this.draw();
    }
    return true;
  }

  nodeParent(id: number): GNode | undefined {
    const nodeLeftid = 2 * id + 1;
    return this.child[nodeLeftid];
  }
  nodeLevel(id: number): number {
    const parentNodeLevel = Math.floor(Math.log2(this.root.id + 1)) + 1;
    return Math.floor(Math.log2(id + 1)) + 1 - parentNodeLevel;
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

      node.x = x + this.translate.x;
      node.y = y + this.translate.y;

      const nodeLeft = this.nodeLeft(node.id);
      const nodeRight = this.nodeRight(node.id);
      if (nodeLeft || nodeRight) {
        const radi = this.nodeRadius;
        const nodeX = maxNodes * radi * Math.pow(2, 1 / this.scale);
        const nodeY =
          this.nodeRadius + maxDepth * radi * Math.pow(2, 1 / this.scale);

        if (nodeLeft) {
          calcNodePositions(
            nodeLeft,
            x - nodeX,
            y + nodeY,
            level + 1,
            maxDepth - 1,
            maxNodes / 2
          );
        }

        if (nodeRight) {
          calcNodePositions(
            nodeRight,
            x + nodeX,
            y + nodeY,
            level + 1,
            maxDepth - 1,
            maxNodes / 2
          );
        }
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
  drawTree(node = this.root, bubble: boolean = true): void {
    if (!node) {
      return;
    }

    const nodeLeft = this.nodeLeft(node.id);
    if (nodeLeft && bubble) {
      this.drawLine(
        node.x,
        node.y,
        nodeLeft.x,
        nodeLeft.y,
        node?.style?.color?.line || this.defaultNode.style.color.line
      );
      this.drawTree(nodeLeft);
    }

    const nodeRight = this.nodeRight(node.id);
    if (nodeRight && bubble) {
      this.drawLine(
        node.x,
        node.y,
        nodeRight.x,
        nodeRight.y,
        node?.style?.color?.line || this.defaultNode.style.color.line
      );
      this.drawTree(nodeRight);
    }
    this.drawNode(node);
  }
  drawNode(node: GNode): void {
    const isMinimized = node.minimized;
    const { x, y, minimized, type, style } = node;
    const image =
      type === "isAvailable"
        ? style?.image?.isAvaliable || this.defaultNode.style.image.isAvaliable
        : type === "isLoading"
        ? style?.image?.isLoading || this.defaultNode.style.image.isLoading
        : style?.image?.default || this.defaultNode.style.image.default;

    const colorType = minimized
      ? style?.color?.isMinimized || this.defaultNode.style.color.isMinimized
      : type === "isAvailable"
      ? style?.color?.isAvaliable || this.defaultNode.style.color.isAvaliable
      : type === "isLoading"
      ? style?.color?.isLoading || this.defaultNode.style.color.isLoading
      : style?.color?.default || this.defaultNode.style.color.default;

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.nodeRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = colorType;
    this.ctx.fill();
    this.ctx.lineWidth =
      node.id === this.me
        ? style?.size?.borderMe || this.defaultNode.style.size.borderMe
        : style?.size?.border || this.defaultNode.style.size.border;
    this.ctx.strokeStyle =
      node.id === this.me
        ? style?.color?.isMe || this.defaultNode.style.color.isMe
        : shadeColor(colorType, 13);
    this.ctx.stroke();
    this.ctx.drawImage(
      image,
      x - this.nodeRadius / 2,
      y - this.nodeRadius / 2,
      this.nodeRadius,
      this.nodeRadius
    );
    this.ctx.closePath();

    if (!isMinimized) {
      this.ctx.beginPath();
      this.ctx.roundRect(
        x - (this.nodeRadius * 4) / 2,
        y + this.nodeRadius + this.nodeRadius / 3,
        this.nodeRadius * 4,
        this.nodeRadius,
        this.nodeRadius / 3
      );
      this.ctx.fillStyle =
        style?.color.textBg || this.defaultNode.style.color.textBg;
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.font = "1rem inherit";
      this.ctx.fillStyle =
        style?.color?.text || this.defaultNode.style.color.text;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      this.ctx.fillText(
        node.id.toString(),
        x,
        y + this.nodeRadius / 2 + this.nodeRadius + this.nodeRadius / 3
      );
    }
  }

  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string
  ): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  findNode(event: MouseEvent): GNode | undefined {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

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
    this.scale++;
    console.log("zoomIn", this.scale);
    this.updateTreeLayout();
    this.draw();
  }

  zoomOut(): void {
    if (this.scale === 1) {
      console.log("zoomOut", this.scale);
      return;
    }
    this.scale--;
    console.log("zoomOut", this.scale);
    this.updateTreeLayout();
    this.draw();
  }
  pan(dx: number, dy: number): void {
    this.translate.x += dx;
    this.translate.y += dy;
    this.updateTreeLayout();
    this.draw();
  }
  goto(id: number): void {
    const node = this.child[id];
    const dx = this.root.x - node.x;
    const dy = this.root.y - node.y;
    this.translate.x = dx;
    this.translate.y = dy;
    this.updateTreeLayout();
    this.draw();
    // this.pan(dx, dy);
  }

  init(onClickNode: (node: GNode) => void): void {
    this.updateTreeLayout();
    this.draw();

    this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
      const node = this.findNode(event);
      let startX = event.clientX - this.translate.x;
      let startY = event.clientY - this.translate.y;

      if (node) {
        onClickNode(node);
      } else {
        let previousTime = 0;

        const mouseMoveHandler = (moveEvent: MouseEvent): void => {
          requestAnimationFrame((time) => {
            if (previousTime !== time) {
              const dx = moveEvent.clientX - this.translate.x - startX;
              const dy = moveEvent.clientY - this.translate.y - startY;

              this.pan(dx, dy);
              startX += dx;
              startY += dy;
            }
            previousTime = time;
          });
        };

        const mouseUpHandler = (): void => {
          this.canvas.removeEventListener("mousemove", mouseMoveHandler);
          this.canvas.removeEventListener("mouseup", mouseUpHandler);
          previousTime = 0;
        };

        this.canvas.addEventListener("mousemove", mouseMoveHandler);
        this.canvas.addEventListener("mouseup", mouseUpHandler);
      }
    });
  }

  static isNodeRight(id: number) {
    return id % 2 === 0;
  }
}
