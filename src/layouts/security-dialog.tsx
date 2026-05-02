"use client";

import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  IconButton,
  Box,
  Typography
} from "@mui/material";
import { Close as CloseIcon, Security as SecurityIcon } from "@mui/icons-material";
import { PasswordManagementCard } from "@/features/account/components/password-management-card";

interface SecurityDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SecurityDialog({ open, onClose }: SecurityDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SecurityIcon color="primary" />
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
          ความปลอดภัยและการจัดการรหัสผ่าน
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ "& .MuiCard-root": { boxShadow: 'none', borderRadius: 0 } }}>
           <PasswordManagementCard />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}
