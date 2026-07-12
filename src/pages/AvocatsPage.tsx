
import React, { FC, useState } from 'react';
import PageContainer from '../components/PageContainer';
import AvocatModal from '../components/modals/AvocatModal';
import { PhoneIcon, MailIcon, CalendarIcon, CourthouseIcon } from '../components/Icons';
import { Avocat, Task } from '../types';

interface AvocatsPageProps {
  avocats: Avocat[];
  tasks?: Task[]; // Made optional for robust compiling
  onAddAvocat: (avocat: Avocat, password?: string) => void;
  onSendEmail: (to: string, subject: string, body: string, recipientName?: string, attachmentName?: string) => void;
}

const AvocatsPage: FC<AvocatsPageProps> = ({ avocats, tasks = [], onAddAvocat, onSendEmail }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAvocat, setSelectedAvocat] = useState<Avocat | null>(null);
    
    const getServiceStatusClass = (status: string) => {
        switch (status) {
            case 'Actif': return 'bg-green-100 text-green-800';
            case 'Omi':
            case 'Omis': return 'bg-yellow-101 text-yellow-810 bg-amber-50 text-amber-800 border-amber-200';
            case 'Mise en disponibilité': return 'bg-blue-101 text-blue-800';
            default: return 'bg-gray-101 text-gray-805';
        }
    };

    return (
        <>
            <PageContainer title="Avocats" buttonLabel="Ajouter un Avocat" onButtonClick={() => setIsAddModalOpen(true)}>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-sm text-gray-600">
                                <th className="p-4 font-semibold">Nom</th>
                                <th className="p-4 font-semibold">Statut au cabinet</th>
                                <th className="p-4 font-semibold">Statut de service</th>
                                <th className="p-4 font-semibold">E-mail</th>
                                <th className="p-4 font-semibold">Téléphone</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {avocats.map(avocat => (
                                <tr key={avocat.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {avocat.photoUrl ? (
                                                <img 
                                                    src={avocat.photoUrl} 
                                                    alt={avocat.fullName} 
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-3xs shrink-0" 
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 font-extrabold flex items-center justify-center text-xs shrink-0 shadow-3xs">
                                                    {avocat.fullName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-semibold text-gray-800 text-sm block leading-tight">{avocat.fullName}</span>
                                                <span className="text-[10px] text-slate-400 font-mono tracking-wider">ID: {avocat.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600 font-medium text-sm">{avocat.cabinetStatus}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getServiceStatusClass(avocat.serviceStatus)}`}>
                                            {avocat.serviceStatus}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{avocat.emails[0]}</td>
                                    <td className="p-4 text-gray-600">{avocat.phone}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setSelectedAvocat(avocat)}
                                                className="text-indigo-600 hover:text-indigo-850 hover:underline font-bold text-sm bg-indigo-50 hover:bg-indigo-100/60 px-3 py-1.5 rounded-xl transition duration-150 cursor-pointer"
                                            >
                                                Voir
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onSendEmail(
                                                        avocat.emails[0] || 'avocat@kbblawfirmscp.com',
                                                        `Instruction Interne Cabinet — Cabinet KBB SARL`,
                                                        `Cher Maître ${avocat.fullName},\n\nDans le cadre de la gestion de nos affaires courantes...\n\nSentiments distingués,\nDirection Générale`,
                                                        avocat.fullName
                                                    );
                                                }}
                                                className="text-slate-500 hover:text-indigo-800 bg-slate-50 hover:bg-indigo-50/55 p-1.5 rounded-xl transition cursor-pointer"
                                                title={`Contacter Me ${avocat.fullName}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PageContainer>
            
            <AvocatModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={onAddAvocat} avocats={avocats} />

            {/* Avocat details modal */}
            {selectedAvocat && (() => {
                const lawyerTasks = tasks.filter(t => t.lawyer.toLowerCase() === selectedAvocat.fullName.toLowerCase());
                
                return (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-4">
                                    {selectedAvocat.photoUrl ? (
                                        <img 
                                            src={selectedAvocat.photoUrl} 
                                            alt={selectedAvocat.fullName} 
                                            className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-inner shrink-0" 
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-xl font-extrabold text-[#15447c] shadow-inner shrink-0">
                                            {selectedAvocat.fullName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-2xs font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">{selectedAvocat.cabinetRole} ({selectedAvocat.cabinetStatus})</span>
                                        <h2 className="text-2xl font-extrabold text-gray-850 leading-tight">{selectedAvocat.fullName}</h2>
                                        <p className="text-2xs font-mono text-gray-400 mt-1">Numéro ONA : <strong className="font-semibold text-gray-600">{selectedAvocat.onaNumber || 'N/A'}</strong></p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedAvocat(null)} 
                                    className="p-1.5 hover:bg-slate-100 rounded-xl text-gray-400 hover:text-gray-600 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Main Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contact Direct</span>
                                        <div className="text-xs text-gray-750 font-medium p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                                            <p className="flex items-center gap-1.5"><PhoneIcon className="w-3.5 h-3.5 text-indigo-600" /> {selectedAvocat.phone}</p>
                                            <p className="flex items-center justify-between gap-1 border-t border-slate-150/50 pt-2 shrink-0">
                                                <span className="flex items-center gap-1.5 truncate">
                                                    <MailIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                                    <span className="truncate">{selectedAvocat.emails.join(', ')}</span>
                                                </span>
                                                <button
                                                    onClick={() => onSendEmail(
                                                        selectedAvocat.emails[0] || 'avocat@kbblawfirmscp.com',
                                                        `Instruction Interne Cabinet — Cabinet KBB SARL`,
                                                        `Cher Maître ${selectedAvocat.fullName},\n\nDans le cadre de la gestion de nos affaires de cabinet...\n\nSentiments distingués,\nDirection Générale`,
                                                        selectedAvocat.fullName
                                                    )}
                                                    className="text-[10px] bg-indigo-100/60 hover:bg-indigo-100 text-indigo-850 font-bold px-2 py-0.5 rounded transition shrink-0 cursor-pointer"
                                                >
                                                    📩 Écrire
                                                </button>
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Prestation de Serments</span>
                                        <p className="text-xs text-gray-750 font-semibold leading-relaxed flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-indigo-600" /> 1er Serment : {selectedAvocat.firstOathDate || 'N/A'}</p>
                                        {selectedAvocat.secondOathDate && (
                                            <p className="text-xs text-gray-750 font-semibold leading-relaxed mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-indigo-600" /> 2nd Serment : {selectedAvocat.secondOathDate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Barreaux</span>
                                        <p className="text-xs text-slate-800 font-semibold leading-relaxed flex items-center gap-1.5">
                                            <CourthouseIcon className="w-3.5 h-3.5 text-indigo-600" />
                                            <span>Principal :</span>
                                            <span className="bg-indigo-50 border border-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded text-2xs">{selectedAvocat.mainBar || 'Non spécifié'}</span>
                                        </p>
                                        {selectedAvocat.secondaryBar ? (
                                            <p className="text-xs text-slate-800 font-semibold leading-relaxed mt-1.5 flex items-center gap-1.5">
                                                <CourthouseIcon className="w-3.5 h-3.5 text-indigo-600" />
                                                <span>Secondaire :</span>
                                                <span className="bg-slate-100 border border-slate-200 text-slate-705 font-bold px-1.5 py-0.5 rounded text-2xs">{selectedAvocat.secondaryBar}</span>
                                            </p>
                                        ) : (
                                            <p className="text-2xs text-gray-400 italic mt-1 font-medium">Aucun barreau secondaire spécifié</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Statut de Service</span>
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-2xs font-bold uppercase tracking-wider mt-1 ${getServiceStatusClass(selectedAvocat.serviceStatus)}`}>
                                            {selectedAvocat.serviceStatus} (depuis le {selectedAvocat.serviceStartDate})
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Mesures Disciplinaires</span>
                                        <p className="text-xs text-gray-650 italic leading-relaxed bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                                            {selectedAvocat.disciplinaryMeasures || "Aucune mesure ou sanction disciplinaire n'est recensée au dossier."}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Comptes Bancaires ({selectedAvocat.bankAccounts?.length || 0})</span>
                                        {!selectedAvocat.bankAccounts || selectedAvocat.bankAccounts.length === 0 ? (
                                            <p className="text-xs text-gray-400 italic leading-relaxed bg-slate-50 border border-dashed border-gray-250 p-2.5 rounded-lg">Aucun compte bancaire configuré.</p>
                                        ) : (
                                            <div className="space-y-1.5 pt-1">
                                                {selectedAvocat.bankAccounts.map((acc, idx) => (
                                                    <div key={idx} className="bg-indigo-50/45 border border-indigo-100 rounded-lg p-2 flex justify-between items-center text-xs font-semibold text-indigo-900 font-mono shadow-3xs">
                                                        <span className="font-bold">🏦 {acc.bankName}</span>
                                                        <span className="text-gray-600 select-all">{acc.accountNumber}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Target Task Log */}
                            <div className="border-t border-gray-100 pt-5">
                                <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest mb-3">
                                    Tâches assignées ({lawyerTasks.length})
                                </h3>

                                {lawyerTasks.length === 0 ? (
                                    <div className="p-5 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
                                        Aucune tâche opérationnelle n'est affectée à cet avocat pour le moment.
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        {lawyerTasks.map(t => (
                                            <div key={t.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-100/50 transition duration-150">
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-850 block leading-tight">{t.name}</span>
                                                    <span className="text-[10px] text-gray-450 font-medium">📜 Dossier : {t.caseId} • Échéance : {t.dueDate}</span>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                    t.status === 'Effectué' ? 'bg-green-50 text-green-700 border-green-100' : 
                                                    t.status === 'Effectué à moitié' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    'bg-rose-50 text-rose-700 border-rose-100'
                                                }`}>
                                                    {t.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions / Footer */}
                            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                                <button 
                                    onClick={() => setSelectedAvocat(null)} 
                                    className="bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold py-2 px-6 rounded-xl transition duration-150 text-sm"
                                >
                                    Fermer le profil
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
};

export default AvocatsPage;
