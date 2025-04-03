import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
/**
 * 
 * Confirmation Dialog Component
 * Provide Dialog UI
 */
export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  content,
  loading
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained" sx={{ bgcolor: "#aaabad" }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" disabled={loading} sx={{ bgcolor: "#05ce80" }}>
          {loading ? "Processing..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
