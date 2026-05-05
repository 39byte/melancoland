"use client";

import { useEffect, useRef } from "react";
import { useCharacterStore } from "@/stores/characterStore";
import { usePresenceStore } from "@/stores/presenceStore";
import { renderCharacter } from "./CharacterSprite";
import { drawNameTag } from "./NameTag";
import { getContext } from "@/engine/canvas";

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 240;
const CELL_SIZE = 8;
const SCALE = 4;

export default function CharacterLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { myCharacter, otherCharacters } = useCharacterStore();
  const { onlineUsers } = usePresenceStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = getContext(canvas);
    let animId: number;

    function draw() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      otherCharacters.forEach((char) => {
        renderCharacter(ctx, char, CELL_SIZE);
        drawNameTag(ctx, char.nickname, char.position.col * CELL_SIZE + 4, char.position.row * CELL_SIZE - 2, false);
      });

      if (myCharacter) {
        renderCharacter(ctx, myCharacter, CELL_SIZE);
        drawNameTag(ctx, myCharacter.nickname, myCharacter.position.col * CELL_SIZE + 4, myCharacter.position.row * CELL_SIZE - 2, true);
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [myCharacter, otherCharacters, onlineUsers]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ width: CANVAS_WIDTH * SCALE, height: CANVAS_HEIGHT * SCALE, imageRendering: "pixelated" }}
    />
  );
}
