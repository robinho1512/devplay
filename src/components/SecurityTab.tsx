import React, { useState } from 'react';
import { 
  ShieldCheck, Fingerprint, Lock, RefreshCw, Languages, Moon, Sun, User, Eye, EyeOff, Save, CheckCircle
} from 'lucide-react';
import { UserStats } from '../types';

interface SecurityTabProps {
  stats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
  lang: 'pt' | 'en';
  triggerNotification: (text: string, title?: string) => void;
}

export default function SecurityTab({ stats, updateStats, lang, triggerNotification }: SecurityTabProps) {
  // Config state
  const [displayName, setDisplayName] = useState(stats.displayName);
  const [bioState, setBioState] = useState(lang === 'pt' ? 'Estudante de engenharia de software fascinado por automatizações.' : 'Software engineer apprentice loving automated software.');
  
  // Security simulators
  const [showBioLockModal, setShowBioLockModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const [show2FAForm, setShow2FAForm] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [is2FASuccess, setIs2FASuccess] = useState(false);

  const [isSyncingBackup, setIsSyncingBackup] = useState(false);

  const t = {
    pt: {
      profileSettings: 'Meu Perfil & Personalização',
      profileSubtitle: 'Ajuste seu nome de visualização, gerencie salvamento em nuvem e altere idioma e tema.',
      nameLabel: 'Seu Nome de Exibição',
      langSelect: 'Mudar Idioma Oficial',
      themeSelect: 'Alterar Tema de Cores',
      saveProfile: 'Confirmar Alterações',
      
      secTitle: 'Mecanismos Avançados de Segurança',
      secSubtitle: 'Proteja seus dados sensíveis de conquistas e pontos com autenticação moderna.',
      biometricTitle: 'Biometria (Touch ID / Face ID)',
      biometricDesc: 'Exigir digital para autorizar resgates de ouros e edição de API Keys.',
      biometricStatusText: 'Biometria Ativa',
      activateBio: 'Configurar Biometria',
      deactivateBio: 'Desativar Biometria',
      
      twoFA: 'Autenticação de Dois Fatores (2FA)',
      twoFADesc: 'Reforçar segurança de acessos gerando códigos descartáveis (TOTP).',
      twoFAEnabled: 'Dois Fatores Ativos',
      activate2fa: 'Ativar Autenticação de 2 Fatores',
      deactivate2fa: 'Desativar 2FA',
      
      backupTitle: 'Backup Automático em Nuvem',
      backupDesc: 'Sincronizar progresso com servidores globais de forma integrada.',
      forceBackup: 'Fazer Backup Manual Agora',
      backupDone: 'Dados sincronizados de forma segura!',
      toastProfileSaved: 'Perfil salvo com sucesso!',
      toastBackup: 'Seus dados foram salvos na nuvem do DevLingo!',
      bioCompleteMsg: 'Autenticação Biométrica Verificada!',
      bioScanning: 'Escaneando impressão digital...',
      otpPlaceholder: 'Código de 6 dígitos (ex: 123456)',
      otpError: 'Código Inválido!'
    },
    en: {
      profileSettings: 'My Developer Profile Settings',
      profileSubtitle: 'Update your display identity, adjust global languages, and swap system appearance.',
      nameLabel: 'Your Display Identity',
      langSelect: 'Override System Language',
      themeSelect: 'Override Visual Theme',
      saveProfile: 'Save Profile Changes',
      
      secTitle: 'Advanced Safety Protocols',
      secSubtitle: 'Shield your learning achievements and streak records with modern authorization.',
      biometricTitle: 'Biometrics (Touch ID / Face ID)',
      biometricDesc: 'Enforce fingerprint checks prior to API key revisions or coin redemptions.',
      biometricStatusText: 'Biometrics Enabled',
      activateBio: 'Configure Biometrics',
      deactivateBio: 'Disable Biometrics',
      
      twoFA: '2-Factor Authentication (2FA)',
      twoFADesc: 'Increase login safety shields with disposable temporal pins (TOTP).',
      twoFAEnabled: '2FA Shields Active',
      activate2fa: 'Configure Two-Factor Code',
      deactivate2fa: 'Disable Two-Factor Auth',
      
      backupTitle: 'Automated Cloud Backups',
      backupDesc: 'Fully synchronize learning history records directly into secure cloud nodes.',
      forceBackup: 'Force manual cloud push',
      backupDone: 'Sync completed safely!',
      toastProfileSaved: 'Profile information updated!',
      toastBackup: 'All variables secured to DevLingo cloud!',
      bioCompleteMsg: 'Biometrics authorized successfully!',
      bioScanning: 'Reading fingerprint scanner...',
      otpPlaceholder: '6-digit pin (e.g. 123456)',
      otpError: 'Incorrect PIN provided!'
    }
  }[lang];

  const handleUpdateProfile = () => {
    updateStats({ displayName });
    triggerNotification(t.toastProfileSaved, 'Profile');
  };

  const handleTriggerBiometric = () => {
    if (stats.isBiometricEnabled) {
      updateStats({ isBiometricEnabled: false });
      triggerNotification(
        lang === 'pt' ? 'Biometria desativada com sucesso.' : 'Biometric locking turned off.',
        'Security'
      );
    } else {
      setShowBioLockModal(true);
      setScanComplete(false);
      setIsScanning(false);
    }
  };

  const simulateFingerprintScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => {
        updateStats({ isBiometricEnabled: true });
        setShowBioLockModal(false);
        triggerNotification(t.bioCompleteMsg, 'Security');
      }, 1000);
    }, 1800);
  };

  const handleToggle2FA = () => {
    if (stats.is2faEnabled) {
      updateStats({ is2faEnabled: false });
      triggerNotification(
        lang === 'pt' ? '2FA desativado.' : 'Two-Factor Authentication deactivated.',
        'Security'
      );
    } else {
      setShow2FAForm(true);
      setIs2FASuccess(false);
    }
  };

  const verifyOTP = () => {
    // Standard mock verification of valid OTP length
    if (otpCode.length === 6) {
      setIs2FASuccess(true);
      setTimeout(() => {
        updateStats({ is2faEnabled: true });
        setShow2FAForm(false);
        setOtpCode('');
        triggerNotification(
          lang === 'pt' ? 'Autenticação de Dois Fatores habilitada!' : '2FA Shield activated successfully!',
          'Security'
        );
      }, 1200);
    } else {
      triggerNotification(t.otpError, 'Error');
    }
  };

  const handleCloudBackup = () => {
    setIsSyncingBackup(true);
    setTimeout(() => {
      setIsSyncingBackup(false);
      triggerNotification(t.toastBackup, 'Cloud Sync');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Profiler settings cards */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5">
          <User className="w-5 h-5 text-indigo-500" />
          <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{t.profileSettings}</h4>
        </div>
        <p className="text-xs text-zinc-400">{t.profileSubtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5">{t.nameLabel}</label>
            <input 
              type="text" 
              id="settings-name-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full max-w-md p-2.5 text-xs text-zinc-900 dark:text-zinc-50 border rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5">{lang === 'pt' ? 'Sua Biografia' : 'Your Developer Bio'}</label>
            <textarea
              rows={2}
              value={bioState}
              onChange={(e) => setBioState(e.target.value)}
              className="w-full max-w-md p-2.5 text-xs text-zinc-900 dark:text-zinc-50 border rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-md pt-2">
          {/* Language Switch */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              <Languages className="w-3.5 h-3.5 inline mr-1" />
              {t.langSelect}
            </label>
            <select
              id="select-app-language"
              value={stats.appLanguage}
              onChange={(e) => updateStats({ appLanguage: e.target.value as any })}
              className="w-full p-2.5 text-xs border rounded-xl border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
            >
              <option value="pt">Português (pt-BR)</option>
              <option value="en">English (US)</option>
            </select>
          </div>

          {/* Theme Change */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              {stats.theme === 'dark' ? <Moon className="w-3.5 h-3.5 inline mr-1" /> : <Sun className="w-3.5 h-3.5 inline mr-1" />}
              {t.themeSelect}
            </label>
            <select
              id="select-app-theme"
              value={stats.theme}
              onChange={(e) => updateStats({ theme: e.target.value as any })}
              className="w-full p-2.5 text-xs border rounded-xl border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
            >
              <option value="dark">Dark Theme (Escuro)</option>
              <option value="light">Light Theme (Claro)</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleUpdateProfile}
            id="btn-save-profile"
            className="flex items-center space-x-1 bg-indigo-650 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-xl text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t.saveProfile}</span>
          </button>
        </div>
      </div>

      {/* SECURITY CONTROLS CARD */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-500 animate-pulse" />
          <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{t.secTitle}</h4>
        </div>
        <p className="text-xs text-zinc-400">{t.secSubtitle}</p>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {/* Biometrics row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-550 flex items-center pr-1.5">
                <Fingerprint className="w-4 h-4 mr-1 text-zinc-400" />
                {t.biometricTitle}
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{t.biometricDesc}</p>
            </div>

            <button
              onClick={handleTriggerBiometric}
              id="btn-trigger-biometric"
              className={`py-1.5 px-4 rounded-lg text-xs font-bold border transition-all ${
                stats.isBiometricEnabled
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-transparent'
              }`}
            >
              {stats.isBiometricEnabled ? t.biometricStatusText : t.activateBio}
            </button>
          </div>

          {/* 2FA row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-550 flex items-center pr-1.5">
                <Lock className="w-4 h-4 mr-1 text-zinc-400" />
                {t.twoFA}
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{t.twoFADesc}</p>
            </div>

            <button
              onClick={handleToggle2FA}
              id="btn-trigger-2fa"
              className={`py-1.5 px-4 rounded-lg text-xs font-bold border transition-all ${
                stats.is2faEnabled
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-transparent'
              }`}
            >
              {stats.is2faEnabled ? t.twoFAEnabled : t.activate2fa}
            </button>
          </div>

          {/* Cloud Auto Backup row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-550 flex items-center pr-1.5">
                <RefreshCw className={`w-4 h-4 mr-1 text-zinc-400 ${isSyncingBackup ? 'animate-spin' : ''}`} />
                {t.backupTitle}
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{t.backupDesc}</p>
            </div>

            <button
              onClick={handleCloudBackup}
              id="btn-cloud-backup"
              disabled={isSyncingBackup}
              className="py-1.5 px-4 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 hover:text-zinc-900 dark:text-zinc-200 border border-transparent hover:border-zinc-300 transition-all cursor-pointer"
            >
              {isSyncingBackup ? 'Sync...' : t.forceBackup}
            </button>
          </div>
        </div>
      </div>

      {/* BIOMETRICS SCAN PROMPT MODAL */}
      {showBioLockModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-sm w-full rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="flex justify-center">
              <div 
                onClick={simulateFingerprintScan}
                className={`p-6 rounded-full cursor-pointer transition-all ${
                  isScanning 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/45 animate-pulse' 
                    : scanComplete 
                      ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-950/45' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-550 hover:bg-zinc-200'
                }`}
              >
                <Fingerprint className="w-14 h-14" />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-zinc-950 dark:text-zinc-50">
                {isScanning ? t.bioScanning : scanComplete ? t.bioCompleteMsg : (lang === 'pt' ? 'Mantenha o clique de toque para cadastrar biometria' : 'Click and hold fingerprint component')}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {lang === 'pt' ? 'Simulação interativa de hardware para Touch ID / FaceID.' : 'Hardware driver simulation sandbox helper details.'}
              </p>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setShowBioLockModal(false)}
                className="text-xs text-zinc-400 hover:underline"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA SCANNER GENERATOR CODE PROMPT */}
      {show2FAForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-850 rounded-xl inline-block">
              {/* Custom simulated visual QR Code block */}
              <div className="w-32 h-32 bg-zinc-900 border-4 border-zinc-900 rounded flex flex-wrap p-2 shadow-sm relative mx-auto">
                <div className="w-8 h-8 bg-white border-4 border-zinc-900 absolute top-2 left-2" />
                <div className="w-8 h-8 bg-white border-4 border-zinc-900 absolute top-2 right-2" />
                <div className="w-8 h-8 bg-white border-4 border-zinc-900 absolute bottom-2 left-2" />
                <div className="w-4 h-4 bg-white absolute bottom-4 right-4" />
                <div className="w-full text-[6px] text-zinc-550 select-none absolute bottom-1 left-0 text-center font-mono font-black scale-75 opacity-20">DEV_TOTP_KEY</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-zinc-950 dark:text-zinc-50">Scanner DevLingo Authenticator Key</h4>
              <p className="text-[11px] text-zinc-400 mt-1">
                {lang === 'pt' ? 'Escreve qualquer sequência de 6 dígitos no campo e confirme para sincronizar.' : 'Input any 6-digit pin code in input to unlock standard code.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <input 
                type="text" 
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder={t.otpPlaceholder}
                className="w-full p-2.5 text-center font-mono text-base tracking-widest border rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none"
              />

              <button
                onClick={verifyOTP}
                disabled={otpCode.length !== 6}
                className="w-full bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold py-2 rounded-xl text-xs"
              >
                Ativar 2FA
              </button>

              <button 
                onClick={() => setShow2FAForm(false)}
                className="block text-center text-zinc-400 text-xs hover:underline mx-auto"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
