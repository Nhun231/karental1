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
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained" disabled={loading}>
          {loading ? "Processing..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
