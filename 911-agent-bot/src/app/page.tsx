"use client";

import * as React from "react";
import Script from "next/script";
import {
  Box,
  Chip,
  Container,
  CssBaseline,
  Grid,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

import Logo from "@/components/logo";
import DroppableColumn from "@/components/DroppableColumn";
import { getCalls, routeCall } from "@/lib/api";
import { Call } from "@/types/call";
import { ConnectInterface, ConnectAgent } from "@/types/connect";

const CCP_URL = process.env.NEXT_PUBLIC_CONNECT_CCP!;

// window.connect type
declare global {
  interface Window {
    connect: ConnectInterface;
  }
}

// One constant height for all three columns
const COLUMN_HEIGHT = 560; // px — tweak if you want

const theme = createTheme({
  palette: {
    primary: { main: "#6C63FF" },
    secondary: { main: "#FF6A3D" },
    background: { default: "#0b1220" },
    text: { primary: "#ffffff" },
  },
  typography: {
    fontFamily:
      '"Poppins",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial',
    h4: { fontWeight: 700, letterSpacing: 0.2 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    body2: { color: "rgba(255,255,255,0.88)" },
  },
  shape: { borderRadius: 16 },
});

function Header(): React.JSX.Element {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        background:
          "linear-gradient(135deg, rgba(108,99,255,0.25), rgba(255,106,61,0.25))",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 96,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Logo width={200} height={110} radius={22} />
        <Typography variant="h4" align="center" color="#fff">
          911 Dispatcher Console
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="rgba(255,255,255,0.85)"
        >
          Agent Control Prioritization • Drag to assign
        </Typography>
      </Toolbar>
    </Paper>
  );
}

export default function Page(): React.JSX.Element {
  const [incoming, setIncoming] = React.useState<Call[]>([]);
  const [agentCol, setAgentCol] = React.useState<Call[]>([]);
  const [aiCol, setAiCol] = React.useState<Call[]>([]);
  const ccpRef = React.useRef<HTMLDivElement>(null);
  const autoAcceptOnce = React.useRef(false);
  const [agentObj, setAgentObj] = React.useState<ConnectAgent | null>(null);
  const streamsInited = React.useRef(false);

  async function refresh(): Promise<void> {
    const [inc, agent, ai] = await Promise.all([
      getCalls("stage=start"),
      getCalls("handledBy=dispatcher"),
      getCalls("handledBy=bot"),
    ]);
    setIncoming(inc);
    setAgentCol(agent);
    setAiCol(ai);
  }

  React.useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), 3000);
    return () => clearInterval(id);
  }, []);

  function onStreamsReady(): void {
    if (streamsInited.current) return;
    if (!window.connect || !ccpRef.current) return;

    window.connect.core.initCCP(ccpRef.current, {
      ccpUrl: CCP_URL,
      loginPopup: true,
      softphone: { allowFramedSoftphone: true },
    });
    window.connect.agent((agent) => setAgentObj(agent));
    window.connect.contact((contact) => {
      contact.onConnecting(() => {
        if (autoAcceptOnce.current) {
          try {
            contact.accept();
          } catch {}
          autoAcceptOnce.current = false;
        }
      });
    });
    streamsInited.current = true;
  }

  const critical = React.useMemo(
    () =>
      incoming
        .filter((c) => Number(c.priority ?? "0") >= 7)
        .sort(
          (a, b) =>
            Number(b.priority ?? "0") - Number(a.priority ?? "0") ||
            (a.startTs ?? 0) - (b.startTs ?? 0)
        ),
    [incoming]
  );
  const nonCritical = React.useMemo(
    () =>
      incoming
        .filter((c) => Number(c.priority ?? "0") <= 6)
        .sort(
          (a, b) =>
            Number(b.priority ?? "0") - Number(a.priority ?? "0") ||
            (a.startTs ?? 0) - (b.startTs ?? 0)
        ),
    [incoming]
  );

  async function onDragEnd(e: DragEndEvent): Promise<void> {
    const id = e.active?.id != null ? String(e.active.id) : undefined;
    const dest = e.over?.id != null ? String(e.over.id) : undefined;
    if (!id || !dest) return;

    if (dest === "agent") {
      await routeCall(id, "dispatcher");
      if (agentObj) {
        try {
          agentObj.setState(window.connect.AgentStateType.ROUTABLE);
        } catch {}
      }
      autoAcceptOnce.current = true;
    } else if (dest === "ai") {
      await routeCall(id, "bot");
    }
    await refresh();
  }

  const counts = {
    agent: agentCol.length,
    ai: aiCol.length,
    crit: critical.length,
    non: nonCritical.length,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Script
        src="/connect-streams-min.js"
        strategy="afterInteractive"
        onLoad={onStreamsReady}
      />

      <Box
        sx={{
          minHeight: "100vh",
          background:
            "radial-gradient(1200px 800px at 50% -200px, rgba(108,99,255,0.35), transparent 60%), radial-gradient(800px 800px at 90% 10%, rgba(255,106,61,0.25), transparent 60%), #0b1220",
          display: "flex",
          alignItems: "flex-start",
          py: 3,
        }}
      >
        <Container maxWidth="xl">
          <Header />

          <DndContext onDragEnd={onDragEnd}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="stretch"
            >
              {/* Left: Agent */}
              <Grid item xs={12} md={3}>
                <Paper
                  elevation={3}
                  sx={{
                    height: COLUMN_HEIGHT,
                    p: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    background:
                      "linear-gradient(180deg, rgba(108,99,255,0.15), rgba(108,99,255,0.05))",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography variant="subtitle1" color="#fff">
                      Agent
                    </Typography>
                    <Chip
                      label={counts.agent}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.08)",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  {/* Scrollable area */}
                  <Box sx={{ flex: 1, overflowY: "auto" }}>
                    <DroppableColumn
                      id="agent"
                      title="Drag here to handle now"
                      items={agentCol}
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Middle: single scrollable stack with Critical + Non-Critical */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{
                    height: COLUMN_HEIGHT,
                    p: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {/* Critical section */}
                    <Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Typography variant="subtitle1" color="#fff">
                          Incoming — Critical (≥7)
                        </Typography>
                        <Chip
                          label={counts.crit}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.08)",
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <DroppableColumn
                        id="incoming-critical"
                        title=""
                        items={critical}
                      />
                    </Box>

                    {/* Non-Critical section */}
                    <Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Typography variant="subtitle1" color="#fff">
                          Incoming — Non-Critical (≤6)
                        </Typography>
                        <Chip
                          label={counts.non}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.08)",
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <DroppableColumn
                        id="incoming-noncritical"
                        title=""
                        items={nonCritical}
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Right: AI */}
              <Grid item xs={12} md={3}>
                <Paper
                  elevation={3}
                  sx={{
                    height: COLUMN_HEIGHT,
                    p: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    background:
                      "linear-gradient(180deg, rgba(108,99,255,0.15), rgba(108,99,255,0.05))",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography variant="subtitle1" color="#fff">
                      AI
                    </Typography>
                    <Chip
                      label={counts.ai}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.08)",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  {/* Scrollable area */}
                  <Box sx={{ flex: 1, overflowY: "auto" }}>
                    <DroppableColumn
                      id="ai"
                      title="Drag here to handoff"
                      items={aiCol}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </DndContext>

          {/* CCP Panel (unchanged) */}
          <Paper
            elevation={3}
            sx={{
              mt: 3,
              p: 2,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Typography variant="h6" color="#fff" sx={{ mb: 1.5 }}>
              Agent CCP
            </Typography>
            <Box
              ref={ccpRef}
              sx={{
                height: 520,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "#0f1628",
              }}
            />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
