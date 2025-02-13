import React from "react";

export default function Palette() {
  return (
    <div>
      <h3>Palette</h3>
      <div className="flex gap-2">
        <div className="bg-primary rounded p-4">Primary</div>
        <div className="bg-secondary rounded p-4">Secondary</div>
        <div className="rounded bg-black p-4">Black</div>
        <div className="bg-gray rounded p-4">Gray</div>
        <div className="rounded bg-white p-4 text-black">White</div>
        <div className="bg-danger rounded p-4">Danger</div>
        <div className="bg-warning rounded p-4 text-black">Warning</div>
        <div className="bg-background rounded border border-white p-4">
          Background
        </div>
        <div className="bg-foreground rounded p-4">Foreground</div>
      </div>
    </div>
  );
}
