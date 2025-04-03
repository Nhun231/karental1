import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button, IconButton, DialogContentText, Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
      <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              closeAfterTransition={false}>
        <DialogTitle id="alert-dialog-title" sx={{
          padding: "16px 24px 0px !important",
          fontWeight: "bold",
          minWidth: "300px",
        }}>{title}</DialogTitle>
        <IconButton aria-label="close" onClick={onClose}
                    sx={(theme) => ({position: "absolute", right: 8, top: 8, color: theme.palette.grey[500],})}>
          <CloseIcon/>
        </IconButton>
        <DialogContent sx={{padding: "16px 24px !important"}}>
          <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "flex-start",
            marginBottom: 1,
          }}>
            <Button variant="contained" onClick={onClose} color="inherit" sx={{width: "150px"}}>
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="contained" disabled={loading} sx={{width: "150px", backgroundColor: "#05ce80"}}>
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
  );
}