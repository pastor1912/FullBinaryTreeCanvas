export const svgUrl = (svg, width, height, viewBox) => {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
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
const svgIsAvailable = (color) => `
  <script xmlns=""></script>
  <style type="text/css">
    .st0{fill:${color};}
  </style>
  <g>
    <path class="st0" d="M458.159,404.216c-18.93-33.65-49.934-71.764-100.409-93.431c-28.868,20.196-63.938,32.087-101.745,32.087   c-37.828,0-72.898-11.89-101.767-32.087c-50.474,21.667-81.479,59.782-100.398,93.431C28.731,448.848,48.417,512,91.842,512   c43.426,0,164.164,0,164.164,0s120.726,0,164.153,0C463.583,512,483.269,448.848,458.159,404.216z"/>
    <path class="st0" d="M256.005,300.641c74.144,0,134.231-60.108,134.231-134.242v-32.158C390.236,60.108,330.149,0,256.005,0   c-74.155,0-134.252,60.108-134.252,134.242V166.4C121.753,240.533,181.851,300.641,256.005,300.641z"/>
  </g>
`;
const svgIsloading = (color) => `
<script xmlns=""/><path id="primary" d="M12,21V18m6.36.36-2.12-2.12M21,12H18m.36-6.36L16.24,7.76M12,3V6M5.64,5.64,7.76,7.76M4,12H6m1,4.95.71-.71" style="stroke: ${color}; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"/>
`;
const svgDefault = (color) => `
<script xmlns=""/>
<style type="text/css">
	.st0{fill:${color};}
</style>
<g>
	<path class="st0" d="M458.159,404.216c-18.93-33.65-49.934-71.764-100.409-93.431c-28.868,20.196-63.938,32.087-101.745,32.087   c-37.828,0-72.898-11.89-101.767-32.087c-50.474,21.667-81.479,59.782-100.398,93.431C28.731,448.848,48.417,512,91.842,512   c43.426,0,164.164,0,164.164,0s120.726,0,164.153,0C463.583,512,483.269,448.848,458.159,404.216z"/>
	<path class="st0" d="M256.005,300.641c74.144,0,134.231-60.108,134.231-134.242v-32.158C390.236,60.108,330.149,0,256.005,0   c-74.155,0-134.252,60.108-134.252,134.242V166.4C121.753,240.533,181.851,300.641,256.005,300.641z"/>
</g>
`;
export const createImage = (src) => {
    const image = new Image();
    image.src = src;
    return image;
};
export function shadeColor(color, percent) {
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
    constructor(canvas, centerX, centerY, defaultNode, child) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        this.centerX = centerX;
        this.centerY = centerY;
        this.nodeRadius = 30;
        this.levelTree = 0;
        this.scale = 1;
        this.translate = { x: 0, y: 0 };
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.centerX = centerX;
        this.centerY = centerY;
        if (child)
            this.child = child;
        const treeNode = {
            minimized: (defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.minimized) || true,
            style: {
                image: {
                    isAvaliable: ((_a = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _a === void 0 ? void 0 : _a.image) ||
                        createImage(svgUrl(svgIsAvailable("#fff"), 1, 1, "0 0 512 512")),
                    isLoading: ((_b = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _b === void 0 ? void 0 : _b.image) ||
                        createImage(svgUrl(svgIsloading("#fff"), 1, 1, "0 0 24 24")),
                    default: ((_c = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _c === void 0 ? void 0 : _c.image) ||
                        createImage(svgUrl(svgIsAvailable("#fff"), 1, 1, "0 0 512 512")),
                },
                color: {
                    isAvaliable: ((_e = (_d = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _d === void 0 ? void 0 : _d.color) === null || _e === void 0 ? void 0 : _e.isAvaliable) || "#3c6",
                    isLoading: ((_g = (_f = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _f === void 0 ? void 0 : _f.color) === null || _g === void 0 ? void 0 : _g.isLoading) || "#c2c2c2",
                    isMinimized: ((_j = (_h = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _h === void 0 ? void 0 : _h.color) === null || _j === void 0 ? void 0 : _j.isMinimized) || "#eee",
                    default: ((_l = (_k = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _k === void 0 ? void 0 : _k.color) === null || _l === void 0 ? void 0 : _l.default) || "#daa520",
                    isMe: ((_o = (_m = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _m === void 0 ? void 0 : _m.color) === null || _o === void 0 ? void 0 : _o.isMe) || "#0971fe",
                    text: ((_q = (_p = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _p === void 0 ? void 0 : _p.color) === null || _q === void 0 ? void 0 : _q.isMe) || "#fff",
                    textBg: ((_s = (_r = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _r === void 0 ? void 0 : _r.color) === null || _s === void 0 ? void 0 : _s.isMe) || "#0040ff",
                    line: ((_u = (_t = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _t === void 0 ? void 0 : _t.color) === null || _u === void 0 ? void 0 : _u.line) || "#fff",
                },
                size: {
                    border: ((_w = (_v = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _v === void 0 ? void 0 : _v.size) === null || _w === void 0 ? void 0 : _w.border) || 1,
                    borderMe: ((_y = (_x = defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style) === null || _x === void 0 ? void 0 : _x.size) === null || _y === void 0 ? void 0 : _y.borderMe) || 2,
                },
            },
        };
        this.defaultNode = treeNode;
    }
    changeRoot(id) {
        this.prevRoot = this.root;
        this.root = undefined;
        this.addNode(id);
    }
    addNode(id, type, defaultNode) {
        const newNode = {
            id,
            type: type,
            x: this.centerX,
            y: this.centerY,
            minimized: (defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.minimized) || false,
            isRoot: false,
            style: defaultNode === null || defaultNode === void 0 ? void 0 : defaultNode.style,
        };
        if (!this.root) {
            this.root = Object.assign(Object.assign({}, newNode), { isRoot: true });
            this.child = this.child || {};
            return true;
        }
        const parentId = BinaryTree.parentNodeId(id);
        let isParent = !!this.child[parentId] ||
            this.root.id === id ||
            this.root.id === parentId;
        if (!isParent) {
            return false;
        }
        const current = this.child[id] || (id === this.root.id ? this.root : undefined);
        if (!current) {
            this.child[id] = newNode;
            this.levelTree =
                this.nodeLevel(id) < this.levelTree
                    ? this.levelTree
                    : this.nodeLevel(id);
            this.updateTreeLayout();
        }
        else {
            current.type = type;
            this.draw();
        }
        return true;
    }
    nodeParent(id) {
        const nodeLeftid = 2 * id + 1;
        return this.child[nodeLeftid];
    }
    nodeLevel(id) {
        const parentNodeLevel = Math.floor(Math.log2(this.root.id + 1)) + 1;
        return Math.floor(Math.log2(id + 1)) + 1 - parentNodeLevel;
    }
    nodeRight(id) {
        const nodeId = 2 * id + 2;
        return this.child[nodeId];
    }
    nodeLeft(id) {
        const nodeId = 2 * id + 1;
        return this.child[nodeId];
    }
    static parentNodeId(id) {
        if (BinaryTree.isNodeRight(id)) {
            return (id - 2) / 2;
        }
        else {
            return (id - 1) / 2;
        }
    }
    updateTreeLayout() {
        if (!this.root) {
            return;
        }
        const calcNodePositions = (node, x, y, level, maxDepth, maxNodes) => {
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
                const nodeY = this.nodeRadius + maxDepth * radi * Math.pow(2, 1 / this.scale);
                if (nodeLeft) {
                    calcNodePositions(nodeLeft, x - nodeX, y + nodeY, level + 1, maxDepth - 1, maxNodes / 2);
                }
                if (nodeRight) {
                    calcNodePositions(nodeRight, x + nodeX, y + nodeY, level + 1, maxDepth - 1, maxNodes / 2);
                }
            }
        };
        calcNodePositions(this.root, this.centerX, this.centerY, 1, this.levelTree, Math.pow(2, this.levelTree + 1) / 2);
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTree();
    }
    drawTree(node = this.root, bubble = true) {
        var _a, _b, _c, _d;
        if (!node) {
            return;
        }
        const nodeLeft = this.nodeLeft(node.id);
        if (nodeLeft && bubble) {
            this.drawLine(node.x, node.y, nodeLeft.x, nodeLeft.y, ((_b = (_a = node === null || node === void 0 ? void 0 : node.style) === null || _a === void 0 ? void 0 : _a.color) === null || _b === void 0 ? void 0 : _b.line) || this.defaultNode.style.color.line);
            this.drawTree(nodeLeft);
        }
        const nodeRight = this.nodeRight(node.id);
        if (nodeRight && bubble) {
            this.drawLine(node.x, node.y, nodeRight.x, nodeRight.y, ((_d = (_c = node === null || node === void 0 ? void 0 : node.style) === null || _c === void 0 ? void 0 : _c.color) === null || _d === void 0 ? void 0 : _d.line) || this.defaultNode.style.color.line);
            this.drawTree(nodeRight);
        }
        this.drawNode(node);
    }
    drawNode(node) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const isMinimized = node.minimized;
        const { x, y, minimized, type, style } = node;
        const image = type === "isAvailable"
            ? ((_a = style === null || style === void 0 ? void 0 : style.image) === null || _a === void 0 ? void 0 : _a.isAvaliable) || this.defaultNode.style.image.isAvaliable
            : type === "isLoading"
                ? ((_b = style === null || style === void 0 ? void 0 : style.image) === null || _b === void 0 ? void 0 : _b.isLoading) || this.defaultNode.style.image.isLoading
                : ((_c = style === null || style === void 0 ? void 0 : style.image) === null || _c === void 0 ? void 0 : _c.default) || this.defaultNode.style.image.default;
        const colorType = minimized
            ? ((_d = style === null || style === void 0 ? void 0 : style.color) === null || _d === void 0 ? void 0 : _d.isMinimized) || this.defaultNode.style.color.isMinimized
            : type === "isAvailable"
                ? ((_e = style === null || style === void 0 ? void 0 : style.color) === null || _e === void 0 ? void 0 : _e.isAvaliable) || this.defaultNode.style.color.isAvaliable
                : type === "isLoading"
                    ? ((_f = style === null || style === void 0 ? void 0 : style.color) === null || _f === void 0 ? void 0 : _f.isLoading) || this.defaultNode.style.color.isLoading
                    : ((_g = style === null || style === void 0 ? void 0 : style.color) === null || _g === void 0 ? void 0 : _g.default) || this.defaultNode.style.color.default;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.nodeRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = colorType;
        this.ctx.fill();
        this.ctx.lineWidth =
            node.id === this.me
                ? ((_h = style === null || style === void 0 ? void 0 : style.size) === null || _h === void 0 ? void 0 : _h.borderMe) || this.defaultNode.style.size.borderMe
                : ((_j = style === null || style === void 0 ? void 0 : style.size) === null || _j === void 0 ? void 0 : _j.border) || this.defaultNode.style.size.border;
        this.ctx.strokeStyle =
            node.id === this.me
                ? ((_k = style === null || style === void 0 ? void 0 : style.color) === null || _k === void 0 ? void 0 : _k.isMe) || this.defaultNode.style.color.isMe
                : shadeColor(colorType, 13);
        this.ctx.stroke();
        this.ctx.drawImage(image, x - this.nodeRadius / 2, y - this.nodeRadius / 2, this.nodeRadius, this.nodeRadius);
        this.ctx.closePath();
        if (!isMinimized) {
            this.ctx.beginPath();
            this.ctx.roundRect(x - (this.nodeRadius * 4) / 2, y + this.nodeRadius + this.nodeRadius / 3, this.nodeRadius * 4, this.nodeRadius, this.nodeRadius / 3);
            this.ctx.fillStyle =
                (style === null || style === void 0 ? void 0 : style.color.textBg) || this.defaultNode.style.color.textBg;
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.font = "1rem inherit";
            this.ctx.fillStyle =
                ((_l = style === null || style === void 0 ? void 0 : style.color) === null || _l === void 0 ? void 0 : _l.text) || this.defaultNode.style.color.text;
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(node.id.toString(), x, y + this.nodeRadius / 2 + this.nodeRadius + this.nodeRadius / 3);
        }
    }
    drawLine(x1, y1, x2, y2, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        this.ctx.closePath();
    }
    findNode(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const searchNode = (node) => {
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
    toggleMinimize(node) {
        node.minimized = !node.minimized;
        this.updateTreeLayout();
        this.draw();
    }
    zoomIn() {
        this.scale++;
        console.log("zoomIn", this.scale);
        this.updateTreeLayout();
        this.draw();
    }
    zoomOut() {
        if (this.scale === 1) {
            console.log("zoomOut", this.scale);
            return;
        }
        this.scale--;
        console.log("zoomOut", this.scale);
        this.updateTreeLayout();
        this.draw();
    }
    pan(dx, dy) {
        this.translate.x += dx;
        this.translate.y += dy;
        this.updateTreeLayout();
        this.draw();
    }
    goto(id) {
        const node = this.child[id];
        const dx = this.root.x - node.x;
        const dy = this.root.y - node.y;
        this.translate.x = dx;
        this.translate.y = dy;
        this.updateTreeLayout();
        this.draw();
        // this.pan(dx, dy);
    }
    init(onClickNode) {
        this.updateTreeLayout();
        this.draw();
        this.canvas.addEventListener("mousedown", (event) => {
            const node = this.findNode(event);
            let startX = event.clientX - this.translate.x;
            let startY = event.clientY - this.translate.y;
            if (node) {
                onClickNode(node);
            }
            else {
                let previousTime = 0;
                const mouseMoveHandler = (moveEvent) => {
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
                const mouseUpHandler = () => {
                    this.canvas.removeEventListener("mousemove", mouseMoveHandler);
                    this.canvas.removeEventListener("mouseup", mouseUpHandler);
                    previousTime = 0;
                };
                this.canvas.addEventListener("mousemove", mouseMoveHandler);
                this.canvas.addEventListener("mouseup", mouseUpHandler);
            }
        });
    }
    static isNodeRight(id) {
        return id % 2 === 0;
    }
}
