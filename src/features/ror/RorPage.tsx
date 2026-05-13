"use client";

import React from "react";
import { useRagnarok } from "./hooks/useRagnarok";
import { HeroSectionV2 } from "./components/HeroSectionV2";
import { GodsPantheonV2 } from "./components/GodsPantheonV2";
import { TheAltarV2 } from "./components/TheAltarV2";
import { LoginSectionV2 } from "./components/LoginSectionV2";
import { ValhallaBoardV2 } from "./components/ValhallaBoardV2";
import { FooterSectionV2 } from "./components/FooterSectionV2";

export const RecordOfRagnarok: React.FC = () => {
  const {
    gods,
    rankingData,
    godsLoading,
    isLoggedIn,
    authLoading,
    error,
    setError,
    logout,
    workflow,
    setWorkflow,
    tfaProviders,
    login,
    verify2faGoogle,
    verify2faSms,
    pledgeData,
    handlePledgeChange,
    supportInfo,
    pledge,
    pledgeLoading,
    pledgeMessage,
    setPledgeMessage,
  } = useRagnarok();

  return (
    <div className="min-h-screen flex flex-col text-white">
      <HeroSectionV2 />

      <div className="flex-1 flex flex-col w-full mx-auto px-4! sm:px-8! lg:px-20! gap-10 pb-8! bg-[#0F172A]">
        <GodsPantheonV2 gods={gods} isLoading={godsLoading} />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 py-4!">
          <div className="md:col-span-2">
            {isLoggedIn ? (
              <TheAltarV2
                gods={gods}
                supportInfo={supportInfo}
                pledgeData={pledgeData}
                onPledgeChange={handlePledgeChange}
                onPledge={pledge}
                isLoading={pledgeLoading}
                message={pledgeMessage}
                onClearMessage={() => setPledgeMessage(null)}
              />
            ) : (
              <LoginSectionV2
                onLogin={login}
                onVerify2fa={verify2faGoogle}
                onVerify2faSms={verify2faSms}
                isLoading={authLoading}
                workflow={workflow}
                onSelectWorkflow={setWorkflow}
                tfaProviders={tfaProviders}
                error={error}
                onClearError={() => setError(null)}
              />
            )}
          </div>
          <div className="md:col-span-3">
            <ValhallaBoardV2 rankingData={rankingData} isLoading={godsLoading} />
          </div>
        </div>
      </div>
      <FooterSectionV2 onLogout={logout} isLoggedIn={isLoggedIn} />
    </div>
  );
};
