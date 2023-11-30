import { Button } from "@mui/material";

export default function TableToolbar() {
  const handleMouseDown = (event) => {
    // Keep the focus in the cell
    event.preventDefault();
  };

  return (
    <>
      <Button onMouseDown={handleMouseDown} variant="outlined" to="/TeamPrizes">
        Prizes
      </Button>
      <Button
        sx={{ ml: 3 }}
        onMouseDown={handleMouseDown}
        variant="outlined"
        to="/Breakdown"
      >
        Breakdown
      </Button>
    </>
  );
}
