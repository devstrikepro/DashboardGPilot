import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Avatar, CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import type { AdminWithdrawal } from "@/shared/services/admin-service";

const fmt = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(val));

const getInitials = (email: string) => {
  const local = email.split("@")[0];
  const parts = local.split(/[._-]/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase();
};

interface WithdrawalActionDialogProps {
  open: boolean;
  action: "approve" | "reject";
  withdrawal: AdminWithdrawal | null;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ACTION_CONFIG = {
  approve: {
    title: "Approve Withdrawal",
    description: "Are you sure you want to approve this withdrawal?",
    confirmLabel: "Approve",
    confirmColor: "#10B981" as const,
    confirmBg: "rgba(16,185,129,0.15)" as const,
    confirmHover: "rgba(16,185,129,0.25)" as const,
    icon: <CheckIcon sx={{ fontSize: 16 }} />,
  },
  reject: {
    title: "Reject Withdrawal",
    description: "Are you sure you want to reject this withdrawal?",
    confirmLabel: "Reject",
    confirmColor: "#EF4444" as const,
    confirmBg: "rgba(239,68,68,0.15)" as const,
    confirmHover: "rgba(239,68,68,0.25)" as const,
    icon: <CloseIcon sx={{ fontSize: 16 }} />,
  },
};

export function WithdrawalActionDialog({ open, action, withdrawal, isLoading, onConfirm, onClose }: WithdrawalActionDialogProps) {
  const config = ACTION_CONFIG[action];

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 0.5 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem", pb: 1 }}>{config.title}</DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {config.description}
        </Typography>

        {withdrawal && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"),
            }}
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: "0.75rem", fontWeight: 700 }}>
              {getInitials(withdrawal.user_email)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {withdrawal.user_email}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                {withdrawal.id}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: '"Inter", monospace', flexShrink: 0 }}>
              {fmt(withdrawal.amount)}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="outlined"
          size="small"
          sx={{ flex: 1, textTransform: "none", fontWeight: 600, borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          size="small"
          startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : config.icon}
          sx={{
            flex: 1,
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            bgcolor: config.confirmBg,
            color: config.confirmColor,
            "&:hover": { bgcolor: config.confirmHover },
            "&.Mui-disabled": { opacity: 0.6 },
          }}
        >
          {isLoading ? "Processing..." : config.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
