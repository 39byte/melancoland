export function drawNameTag(
  ctx: CanvasRenderingContext2D,
  name: string,
  x: number,
  y: number,
  isMe: boolean
) {
  ctx.font = "3px monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = isMe ? "#228B22" : "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 0.5;
  ctx.strokeText(name, x, y);
  ctx.fillText(name, x, y);
}
