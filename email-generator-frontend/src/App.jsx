import { useState } from 'react'
import {
  Box, Container, TextField, Typography, Button,
  ToggleButton, ToggleButtonGroup, Chip, CircularProgress,
  Snackbar, Alert, Paper, Divider, Fade
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';

const tones = ['Professional', 'Formal', 'Friendly', 'Casual', 'Concise'];

// ── paste this inside your App.css or a <style> tag in index.html ──
// No extra CSS file needed — all styling is done via MUI sx props below.
// The only optional addition is a Google Font import in your index.html:
//   <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap" rel="stylesheet">

function App() {
  const [emailContent, setEmailContent]   = useState('');
  const [tone, setTone]                   = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [copied, setCopied]               = useState(false);
  const [snackOpen, setSnackOpen]         = useState(false);

  // ── unchanged handler ──
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8081/api/email/generate', {
        emailContent,
        tone,
      });
      setGeneratedReply(
        typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      );
    } catch (err) {
      setError(err.message);
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #eef1fb 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="sm">

        {/* ── Header ── */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
            label="AI Powered"
            size="small"
            sx={{
              mb: 2,
              background: '#e8eaff',
              color: '#3d47c9',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: 0.5,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontWeight: 400,
              fontSize: { xs: 32, sm: 40 },
              color: '#0f1133',
              lineHeight: 1.15,
            }}
          >
            Email Reply<br />Generator
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5, color: '#6b7280' }}>
            Paste an email, pick a tone, get a polished reply instantly.
          </Typography>
        </Box>

        {/* ── Input card ── */}
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e4e7f0',
            borderRadius: 4,
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {/* Email textarea */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="overline"
              sx={{ color: '#9ca3af', fontWeight: 700, letterSpacing: 1.2, fontSize: 10 }}
            >
              Original Email
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="standard"
              placeholder="Paste the email you want to reply to…"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              InputProps={{ disableUnderline: true }}
              sx={{
                mt: 1,
                '& textarea': {
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: '#1f2937',
                  '&::placeholder': { color: '#d1d5db' },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{ display: 'block', textAlign: 'right', color: '#d1d5db', mt: 1 }}
            >
              {emailContent.length} chars
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#f0f2f8' }} />

          {/* Tone picker */}
          <Box sx={{ px: 3, py: 2.5 }}>
            <Typography
              variant="overline"
              sx={{ color: '#9ca3af', fontWeight: 700, letterSpacing: 1.2, fontSize: 10 }}
            >
              Tone
            </Typography>
            <ToggleButtonGroup
              value={tone}
              exclusive
              onChange={(_, val) => setTone(val ?? '')}
              sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1, '& .MuiToggleButtonGroup-grouped': { border: 'none !important', borderRadius: '999px !important' } }}
            >
              {tones.map((t) => (
                <ToggleButton
                  key={t}
                  value={t}
                  size="small"
                  sx={{
                    px: 2,
                    py: 0.6,
                    fontSize: 12,
                    fontWeight: 500,
                    textTransform: 'none',
                    borderRadius: '999px',
                    border: '1px solid #e4e7f0 !important',
                    color: '#6b7280',
                    '&.Mui-selected': {
                      background: '#3d47c9',
                      color: '#fff',
                      borderColor: '#3d47c9 !important',
                      '&:hover': { background: '#3340b8' },
                    },
                    '&:hover': { background: '#f5f6ff' },
                  }}
                >
                  {t}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Divider sx={{ borderColor: '#f0f2f8' }} />

          {/* Generate button */}
          <Box sx={{ p: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={!emailContent.trim() || loading}
              disableElevation
              endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: 16 }} />}
              sx={{
                py: 1.4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #3d47c9 0%, #5b67e8 100%)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 0.3,
                '&:hover': { background: 'linear-gradient(135deg, #3340b8 0%, #4f5adc 100%)' },
                '&.Mui-disabled': { background: '#e9ebf5', color: '#b0b7d6' },
              }}
            >
              {loading ? 'Generating…' : 'Generate Reply'}
            </Button>
          </Box>
        </Paper>

        {/* ── Result card ── */}
        <Fade in={!!generatedReply}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid #e4e7f0',
              borderRadius: 4,
              overflow: 'hidden',
              display: generatedReply ? 'block' : 'none',
            }}
          >
            <Box
              sx={{
                px: 3, py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fafbff',
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: '#9ca3af', fontWeight: 700, letterSpacing: 1.2, fontSize: 10 }}
              >
                Generated Reply
              </Typography>
              <Button
                size="small"
                onClick={handleCopy}
                startIcon={copied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
                sx={{
                  textTransform: 'none',
                  fontSize: 12,
                  fontWeight: 500,
                  color: copied ? '#16a34a' : '#6b7280',
                  border: `1px solid ${copied ? '#bbf7d0' : '#e4e7f0'}`,
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.4,
                  minWidth: 0,
                  '&:hover': { background: '#f5f6ff' },
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </Box>

            <Divider sx={{ borderColor: '#f0f2f8' }} />

            <Box sx={{ p: 3 }}>
              <Typography
                component="pre"
                sx={{
                  fontFamily: '"Instrument Serif", Georgia, serif',
                  fontSize: 15,
                  lineHeight: 1.85,
                  color: '#1f2937',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  m: 0,
                }}
              >
                {generatedReply}
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* ── Error snackbar ── */}
        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setSnackOpen(false)} sx={{ borderRadius: 3 }}>
            {error}
          </Alert>
        </Snackbar>

      </Container>
    </Box>
  );
}

export default App;