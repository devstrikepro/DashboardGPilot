import { Box } from "@mui/material";

interface SectionIconBoxProps {
  bg: string;
  color: string;
  children: React.ReactNode;
}

export function SectionIconBox({ bg, color, children }: SectionIconBoxProps) {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: 2,
        bgcolor: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
}
