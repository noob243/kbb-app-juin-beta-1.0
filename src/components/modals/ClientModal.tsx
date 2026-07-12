
import React, { FC, useState, useEffect } from 'react';
import { Client } from '../../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id'> & { id?: string | number }) => void;
}

const ClientModal: FC<ClientModalProps> = ({ isOpen, onClose, onSave }) => {
    const initialFormState = {
        name: '', clientId: '', dossier: '', logo: null as File | null, logoUrl: '', siege: '', secteur: '',
        dirigeant: '', ref1_nom: '', ref1_phone: '', ref1_email: '',
        ref2_nom: '', ref2_phone: '', ref2_email: '', email: '', phone: '',
        typeFacturation: 'Forfaitaire',
    };
    const [formData, setFormData] = useState(initialFormState);
    const [additionalSieges, setAdditionalSieges] = useState<string[]>([]);

    useEffect(() => {
        if (formData.name) {
            const cleanName = formData.name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
            const words = cleanName.split(/[^A-Z0-9]+/).filter(Boolean);
            let initials = words.map(w => w[0]).join('');
            if (initials.length < 2 && cleanName.length >= 3) {
                initials = cleanName.slice(0, 3).replace(/[^A-Z0-9]/g, '');
            }
            const finalInitials = initials || 'CLI';
            const digits = Date.now().toString().slice(-4);
            const generatedId = `CLI-${finalInitials}-${digits}`;
            setFormData(prev => ({ ...prev, clientId: generatedId }));
        } else {
            setFormData(prev => ({ ...prev, clientId: '' }));
        }
    }, [formData.name]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ 
                    ...prev, 
                    logo: file, 
                    logoUrl: reader.result as string 
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            id: formData.clientId,
            name: formData.name, 
            contact: formData.dirigeant || 'Non spécifié', 
            cases: 0,
            email: formData.email,
            phone: formData.phone,
            secteur: formData.secteur,
            siege: formData.siege,
            sieges: additionalSieges.filter(s => s.trim() !== ''),
            dirigeant: formData.dirigeant,
            ref1_nom: formData.ref1_nom,
            ref1_phone: formData.ref1_phone,
            ref1_email: formData.ref1_email,
            ref2_nom: formData.ref2_nom,
            ref2_phone: formData.ref2_phone,
            ref2_email: formData.ref2_email,
            typeFacturation: formData.typeFacturation,
            logoUrl: formData.logoUrl || undefined,
        });
        setFormData(initialFormState);
        setAdditionalSieges([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Ajouter un nouveau client</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom client <span className="text-red-500">*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID client (auto)</label>
                                <input type="text" name="clientId" value={formData.clientId} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dossier</label>
                                <input type="text" name="dossier" placeholder="Cliquer pour lier un dossier..." value={formData.dossier} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Photo ou Logo</label>
                                <input type="file" name="logo" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Type de facturation (Sélection multiple possible)</label>
                                <div className="space-y-1.5 border border-gray-300 p-3 rounded-lg overflow-y-auto max-h-40 bg-slate-50/50">
                                    {[
                                        { value: 'Forfaitaire', label: 'Forfaitaire' },
                                        { value: 'Taux horaire', label: 'Taux horaire' },
                                        { value: 'Abonnement mensuel', label: 'Abonnement mensuel' },
                                        { value: 'Abonnement annuel', label: 'Abonnement annuel' },
                                        { value: 'Au dossier (Ponctuelle)', label: 'Au dossier (Ponctuelle)' }
                                    ].map(opt => {
                                        const currentTypes = formData.typeFacturation ? formData.typeFacturation.split(',').map((t: string) => t.trim()) : [];
                                        const isChecked = currentTypes.includes(opt.value);
                                        return (
                                            <label key={opt.value} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none py-1 hover:bg-slate-100 rounded px-1.5 transition">
                                                <input 
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => {
                                                        let newTypes;
                                                        if (isChecked) {
                                                            newTypes = currentTypes.filter((t: string) => t !== opt.value);
                                                        } else {
                                                            newTypes = [...currentTypes, opt.value];
                                                        }
                                                        setFormData(prev => ({ ...prev, typeFacturation: newTypes.join(', ') }));
                                                    }}
                                                    className="h-3.5 w-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                />
                                                <span>{opt.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                             <div>
                                <button type="button" onClick={() => alert("Lier au menu Facturation")} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 shadow-sm">Créer facture</button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Siège social</label>
                                <input type="text" name="siege" value={formData.siege} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            
                            <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/60 space-y-3.5 mt-2">
                                <div className="flex justify-between items-center pb-2 border-b border-indigo-100/30">
                                    <span className="text-[10px] font-black text-[#15447c] uppercase tracking-wider block">adresse additionnelle</span>
                                    <span className="text-3xs font-bold text-indigo-505 bg-indigo-50 px-2 py-0.5 rounded-full">
                                        {additionalSieges.length} secondaire{additionalSieges.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                {additionalSieges.map((value, index) => (
                                    <div key={index} className="flex gap-2 items-center animate-fadeIn">
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                                const updated = [...additionalSieges];
                                                updated[index] = e.target.value;
                                                setAdditionalSieges(updated);
                                            }}
                                            placeholder={`Ex: Avenue Tombalbaye n°${index + 12}, Gombe, Kinshasa`}
                                            className="flex-1 p-2 bg-white border border-gray-300 rounded-xl shadow-xs text-2xs font-medium text-gray-800 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAdditionalSieges(additionalSieges.filter((_, idx) => idx !== index));
                                            }}
                                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold rounded-xl border border-red-200 hover:border-red-300 transition-all text-sm flex items-center justify-center w-8 h-8"
                                            title="Supprimer cette adresse"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setAdditionalSieges([...additionalSieges, ''])}
                                    className="w-full py-2 px-3 bg-[#15447c]/5 hover:bg-[#15447c]/10 text-[#15447c] font-black rounded-xl border border-dashed border-[#15447c]/25 transition text-[10px] uppercase tracking-widest"
                                >
                                    + Ajouter un autre siège social/adresse
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d'activité</label>
                                <input type="text" name="secteur" value={formData.secteur} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirigeant Principal</label>
                                <input type="text" name="dirigeant" value={formData.dirigeant} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <fieldset className="border p-4 rounded-md">
                                <legend className="text-sm font-medium text-gray-700 px-2">Référent 1</legend>
                                <div className="space-y-2">
                                    <input type="text" name="ref1_nom" placeholder="Nom" value={formData.ref1_nom} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                    <input type="tel" name="ref1_phone" placeholder="Téléphone" value={formData.ref1_phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                    <input type="email" name="ref1_email" placeholder="E-mail" value={formData.ref1_email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                            </fieldset>
                             <fieldset className="border p-4 rounded-md">
                                <legend className="text-sm font-medium text-gray-700 px-2">Référent 2</legend>
                                <div className="space-y-2">
                                    <input type="text" name="ref2_nom" placeholder="Nom" value={formData.ref2_nom} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                    <input type="tel" name="ref2_phone" placeholder="Téléphone" value={formData.ref2_phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                    <input type="email" name="ref2_email" placeholder="E-mail" value={formData.ref2_email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition duration-300">Annuler</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-sm">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientModal;
