type TileProps = {
  color: string;
  letter?: string;
  active?: boolean;
  started?: boolean;
};

export default function Tile({ color, letter, active, started }: TileProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          borderRadius: "50%",
          border: "8px solid black",
          fontSize: 55,
          fontWeight: "bold",
          color: "#fff",
          width: 80,
          height: 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `radial-gradient(circle at 30% 30%, ${color}, #111)`,
          boxShadow: active
            ? `0 0 20px 10px gold, 0 5px 15px rgba(0,0,0,0.6)`
            : "0 5px 15px rgba(0,0,0,0.4)",
          transition: "all 0.2s ease-out",
        }}
      >
        {letter}
      </div>

      <div
        style={{
          width: started ? 200 : 150,
          height: started ? 200 : 150,
          borderRadius: 20,
          background: `linear-gradient(145deg, ${color}, #000)`,
          border: active ? "6px solid gold" : "4px solid black",
          transform: active ? "scale(1.2) rotate(-2deg)" : "scale(1)",
          boxShadow: active
            ? "0 0 40px 15px gold, 0 10px 30px rgba(0,0,0,0.6)"
            : "0 5px 15px rgba(0,0,0,0.4)",
          transition: "all 0.2s ease-out",
        }}
      ></div>
    </div>
  );
}

