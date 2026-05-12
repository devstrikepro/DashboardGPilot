import React, { useState } from "react";
import { TextField, Button, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff } from "@mui/icons-material";

export interface LoginSectionV2Props {
  onLogin: (email: string, password: string) => Promise<void>;
  onVerify2fa: (code: string) => Promise<void>;
  onVerify2faSms?: (code: string) => Promise<void>;
  isLoading: boolean;
  workflow: string | null;
  onSelectWorkflow?: (w: string) => void;
  tfaProviders: any[];
  error: string | null;
  onClearError: () => void;
}

export const LoginSectionV2 = ({
  onLogin,
  onVerify2fa,
  onVerify2faSms,
  isLoading,
  workflow,
  onSelectWorkflow,
  tfaProviders,
  error,
  onClearError,
}: LoginSectionV2Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [code, setCode] = useState("");

  const is2fa = workflow === "2fa_google_auth" || workflow === "2fa_sms_auth" || workflow === "2fa";
  const isMultiChoice = workflow === "2fa";
  const isSms = workflow === "2fa_sms_auth";

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && password) onLogin(email, password);
  };
  const handle2fa = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length === 6) isSms && onVerify2faSms ? onVerify2faSms(code) : onVerify2fa(code);
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      backgroundColor: "rgba(255,255,255,0.05)",
      "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&:hover fieldset": { borderColor: "#d4af37" },
      "&.Mui-focused fieldset": { borderColor: "#d4af37" },
    },
    "& input::placeholder": { color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" },
  };

  const btnSx = {
    backgroundColor: "#d4af37",
    color: "#000",
    fontWeight: 800,
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    py: 1.25,
    "&:hover": { backgroundColor: "#b8960f" },
    "&.Mui-disabled": { backgroundColor: "rgba(212,175,55,0.2)", color: "rgba(255,255,255,0.3)" },
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-center">
        <h2 className="text-[#d4af37] font-bold text-lg">{is2fa ? "SECURITY" : "LOGIN"}</h2>
        <p className="text-slate-400 text-xs">{is2fa ? "(2FA VERIFICATION)" : "(AUTHENTICATE)"}</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm p-6! flex flex-col gap-4 min-h-90 justify-center">
        {!is2fa ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <h3 className="text-white font-black text-xl text-center">
              ENTER THE
              <br />
              VALHALLA
            </h3>
            <TextField
              fullWidth
              size="small"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) onClearError();
              }}
              disabled={isLoading}
              sx={inputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#8b949e", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              size="small"
              placeholder="Password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) onClearError();
              }}
              disabled={isLoading}
              sx={{ ...inputSx, "& input::-ms-reveal": { display: "none" }, "& input::-ms-clear": { display: "none" } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#8b949e", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} edge="end" disabled={isLoading}>
                        {showPass ? <VisibilityOff sx={{ color: "#8b949e", fontSize: 18 }} /> : <Visibility sx={{ color: "#8b949e", fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {error && <p className="text-red-400 text-xs font-semibold">* {error}</p>}
            <Button fullWidth variant="contained" type="submit" disabled={isLoading || !email || !password} sx={btnSx}>
              {isLoading ? <CircularProgress size={20} sx={{ color: "#000" }} /> : "SIGN IN TO PLEDGE"}
            </Button>
          </form>
        ) : isMultiChoice ? (
          <div className="flex flex-col gap-4">
            <h3 className="text-[#d4af37] font-black text-xl text-center">
              SELECT
              <br />
              VERIFICATION
            </h3>
            <p className="text-slate-400 text-xs text-center">Choose your preferred 2FA method.</p>
            {tfaProviders.map((p) => (
              <Button
                key={p.type}
                fullWidth
                variant="outlined"
                onClick={() => onSelectWorkflow?.(p.type === "google" ? "2fa_google_auth" : "2fa_sms_auth")}
                sx={{
                  borderColor: "rgba(212,175,55,0.5)",
                  color: "#fff",
                  py: 1.25,
                  "&:hover": { borderColor: "#d4af37", backgroundColor: "rgba(212,175,55,0.1)" },
                }}
              >
                {p.type === "google" ? "Google Authenticator" : "SMS Verification"}
              </Button>
            ))}
          </div>
        ) : (
          <form onSubmit={handle2fa} className="flex flex-col gap-4">
            <h3 className="text-[#d4af37] font-black text-xl text-center">
              {isSms ? "SMS" : "GOOGLE"}
              <br />
              AUTHENTICATOR
            </h3>
            <p className="text-slate-400 text-xs text-center">{isSms ? "Enter the code sent to your phone." : "Enter the 6-digit code from your app."}</p>
            <TextField
              fullWidth
              size="small"
              placeholder="000000"
              value={code}
              autoFocus
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                if (error) onClearError();
              }}
              disabled={isLoading}
              sx={{ ...inputSx, "& input": { textAlign: "center", fontSize: "1.8rem", letterSpacing: "0.5rem", fontWeight: 700 } }}
            />
            {error && <p className="text-red-400 text-xs font-semibold text-center">* {error}</p>}
            <Button fullWidth variant="contained" type="submit" disabled={isLoading || code.length !== 6} sx={btnSx}>
              {isLoading ? <CircularProgress size={20} sx={{ color: "#000" }} /> : "VERIFY AND ENTER"}
            </Button>
          </form>
        )}
        <p className="text-slate-500 text-[10px] text-center mt-auto">
          {is2fa ? "Wait for the code to refresh if it fails" : "Unlock the altar by signing in"}
        </p>
      </div>
    </div>
  );
};
