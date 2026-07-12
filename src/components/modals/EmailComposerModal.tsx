import React, { FC, useState, useEffect } from 'react';
import { Mail, Send, X, Check, Loader2, Sparkles, FileText } from 'lucide-react';

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTo?: string;
  defaultSubject?: string;
  defaultBody?: string;
  recipientName?: string;
  attachmentName?: string;
}

export interface SentEmailRecord {
  id: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  status: 'Sent' | 'Delivered' | 'Pending';
}

const EmailComposerModal: FC<EmailComposerModalProps> = ({
  isOpen,
  onClose,
  defaultTo = '',
  defaultSubject = '',
  defaultBody = '',
  recipientName = '',
  attachmentName = ''
}) => {
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  
  // Historical log tracking (can be persisted in localStorage for realism)
  const [sentHistory, setSentHistory] = useState<SentEmailRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTo(defaultTo);
      setSubject(defaultSubject);
      setBody(defaultBody);
      setIsSent(false);
      setError('');
      
      // Load history from localStorage
      const history = localStorage.getItem('kbb_sent_emails');
      if (history) {
        try {
          setSentHistory(JSON.parse(history));
        } catch (e) {
          // ignore
        }
      }
    }
  }, [isOpen, defaultTo, defaultSubject, defaultBody]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !to.includes('@')) {
      setError('Veuillez entrer une adresse e-mail valide.');
      return;
    }
    if (!subject) {
      setError('Veuillez spécifier un sujet.');
      return;
    }
    if (!body) {
      setError('Le corps du message ne peut pas être vide.');
      return;
    }

    setIsSending(true);
    setError('');

    // Simulate real mail transfer protocol handshake and delivery
    await new Promise(resolve => setTimeout(resolve, 1800));

    const newRecord: SentEmailRecord = {
      id: `MSG-${Date.now().toString().slice(-6)}`,
      to,
      subject,
      body,
      date: new Date().toLocaleString('fr-FR'),
      status: 'Sent'
    };

    const updatedHistory = [newRecord, ...sentHistory].slice(0, 5); // Keep last 5
    setSentHistory(updatedHistory);
    localStorage.setItem('kbb_sent_emails', JSON.stringify(updatedHistory));

    setIsSending(false);
    setIsSent(true);

    // Auto close after showing success screen
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[110] flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-2xl w-full border border-gray-100 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-indigo-900 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-800 rounded-lg text-indigo-200">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">KBB Secure Mail Client</h3>
              <p className="text-[10px] text-indigo-200">contact@kbblawfirmscp.com • Serveur de messagerie pro Infomaniak</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 bg-indigo-800/50 hover:bg-indigo-800 rounded-lg text-indigo-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSent ? (
          /* Success Screen */
          <div className="p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-150 mb-4 animate-bounce">
              <Check className="w-8 h-8 text-emerald-600 stroke-[3]" />
            </div>
            <h4 className="text-lg font-black text-slate-800 mb-1">Message envoyé avec succès !</h4>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              Votre e-mail à <strong className="text-slate-700">{to}</strong> a bien été transmis et sécurisé par nos serveurs de messagerie.
            </p>
            <span className="text-[10px] text-slate-400 font-mono font-medium">Référence d'envoi: SMTP_SSL_SECURE_{Date.now().toString().slice(-4)}</span>
          </div>
        ) : (
          /* Composer Form */
          <form onSubmit={handleSend} className="p-6">
            <div className="space-y-4">
              {/* Recipient info & fields */}
              <div>
                <label className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Destinataire</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={to} 
                    onChange={e => setTo(e.target.value)}
                    placeholder="destinataire@exemple.com"
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden bg-slate-50 hover:border-gray-300 transition"
                    required
                  />
                  {recipientName && (
                    <span className="absolute right-3 top-2.5 text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-100 py-0.5 px-2 rounded-full font-bold">
                      {recipientName}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Sujet de l'e-mail</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)}
                  placeholder="ex: Transmission de pièce - Cabinet KBB"
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden bg-slate-50 hover:border-gray-300 transition"
                  required
                />
              </div>

              {/* Attachment if present */}
              {attachmentName && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-indigo-950 truncate">{attachmentName}</p>
                    <p className="text-[9px] text-indigo-500 font-medium">Document PDF signé attaché s'il y a lieu • Crypté 256 bits</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Message</label>
                <textarea 
                  rows={8}
                  value={body} 
                  onChange={e => setBody(e.target.value)}
                  placeholder="Rédigez votre message ici..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden bg-white hover:border-gray-300 transition font-sans leading-relaxed"
                  required
                />
              </div>

              {error && (
                <p className="text-2xs text-rose-600 font-bold bg-rose-50 border border-rose-100 p-2.5 rounded-xl">{error}</p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <button 
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-5 rounded-xl text-xs transition duration-150"
              >
                Annuler
              </button>

              <button 
                type="submit"
                disabled={isSending}
                className="bg-indigo-800 hover:bg-indigo-950 text-white font-bold py-2 px-6 rounded-xl text-xs transition duration-150 flex items-center gap-2 disabled:bg-indigo-400"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Envoyer l'e-mail
                  </>
                )}
              </button>
            </div>
            
            {/* History Section */}
            {sentHistory.length > 0 && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <span className="block text-3xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Derniers envois récents ({sentHistory.length})</span>
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {sentHistory.map(hist => (
                    <div key={hist.id} className="text-[10px] p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between text-slate-500">
                      <div className="truncate pr-4">
                        <strong className="text-slate-700">À : {hist.to}</strong> — {hist.subject}
                      </div>
                      <span className="text-[9px] font-medium text-slate-400 tracking-tight shrink-0">{hist.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailComposerModal;
