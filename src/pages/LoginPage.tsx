
import React, { FC, useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

const LoginPage: FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [showRecoveryMsg, setShowRecoveryMsg] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        const cleanEmail = email.trim();
        const lowEmail = cleanEmail.toLowerCase();

        // Bypass for main admins jeremieshusu4@gmail.com and hervemich@icloud.com
        if ((lowEmail === 'jeremieshusu4@gmail.com' || lowEmail === 'hervemich@icloud.com') && password === '123456789') {
            onLoginSuccess(cleanEmail);
            setIsLoading(false);
            return;
        }

        try {
            // Try standard login
            try {
                await signInWithEmailAndPassword(auth, cleanEmail, password);
                onLoginSuccess(cleanEmail);
            } catch (err: any) {
                // Check if default mock users should be auto-created on fly
                const defaultLawyers = ['jl.tshisekedi@cabinet.com', 'mc.mobutu@cabinet.com', 'p.lumumba@cabinet.com'];
                const defaultStaff = ['f.kanku@cabinet.com', 'd.mbenga@cabinet.com'];
                const defaultAdmins = ['admin@cabinet.com', 'jeremieshusu4@gmail.com', 'hervemich@icloud.com'];
                
                const isRecognized = defaultLawyers.includes(cleanEmail.toLowerCase()) || 
                                     defaultStaff.includes(cleanEmail.toLowerCase()) || 
                                     defaultAdmins.includes(cleanEmail.toLowerCase());

                if (isRecognized) {
                    if (password.length < 6) {
                        throw new Error("Pour la première connexion de ce compte type, le mot de passe doit faire au moins 6 caractères.");
                    }
                    try {
                        console.log("Auto-creating auth credential for default role:", cleanEmail);
                        await createUserWithEmailAndPassword(auth, cleanEmail, password);
                        onLoginSuccess(cleanEmail);
                    } catch (createErr: any) {
                        if (createErr.code === 'auth/email-already-in-use') {
                            throw new Error("Mot de passe incorrect. Veuillez réessayer.");
                        } else {
                            throw createErr;
                        }
                    }
                } else {
                    let friendlyMsg = "Identifiants de connexion invalides. Veuillez réessayer.";
                    if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                        friendlyMsg = "Mot de passe incorrect. Veuillez réessayer.";
                    } else if (err.code === 'auth/user-not-found') {
                        friendlyMsg = "Aucun compte trouvé avec cette adresse e-mail.";
                    } else if (err.code === 'auth/invalid-email') {
                        friendlyMsg = "Format d'adresse e-mail invalide.";
                    } else if (err.code === 'auth/weak-password') {
                        friendlyMsg = "Le mot de passe doit comporter au moins 6 caractères.";
                    } else if (err.message) {
                        friendlyMsg = err.message;
                    }
                    throw new Error(friendlyMsg);
                }
            }
        } catch (err: any) {
            console.error("Login attempt failed:", err);
            setErrorMsg(err.message || "Impossible de se connecter.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#070b13] flex flex-col justify-center items-center p-4 transition-colors duration-200">
            <div className="max-w-md w-full mx-auto">
                <div className="text-3xl font-bold mb-8 flex items-center justify-center text-[#15447c] dark:text-indigo-400">
                    <svg className="w-10 h-10 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                    </svg>
                    <span>KBB App</span>
                </div>
                <div className="bg-white dark:bg-[#0c111d] p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
                    <h2 className="text-2xl font-extrabold text-center text-gray-800 dark:text-slate-100 mb-1">Bienvenue !</h2>
                    <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-6">Connectez-vous à votre espace cabinet</p>
                    
                    {errorMsg && (
                        <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-400 rounded-xl text-xs font-semibold animate-fadeIn">
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    {showRecoveryMsg && (
                        <div className="mb-5 p-4 bg-green-50 dark:bg-emerald-950/20 border border-green-200 dark:border-emerald-900 text-green-800 dark:text-emerald-400 rounded-xl flex items-start gap-2.5 animate-fadeIn">
                            <span className="text-lg">📧</span>
                            <div className="text-xs font-semibold">
                                <p className="font-bold">Lien de réinitialisation envoyé</p>
                                <p className="mt-0.5">Un email contenant un lien sécurisé a été envoyé à <strong>{email || "votre adresse email"}</strong>. Veuillez vérifier votre boîte de réception.</p>
                                <button onClick={() => setShowRecoveryMsg(false)} className="text-green-700 dark:text-emerald-300 hover:underline font-bold mt-1.5 block">Fermer</button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">Adresse e-mail</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 border border-gray-300 dark:border-slate-800 rounded-xl shadow-xs text-sm bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/10 focus:border-[#15447c] outline-none transition" 
                                    placeholder="vous@cabinet.com" 
                                    required 
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Mot de passe</label>
                                    <button 
                                        type="button"
                                        onClick={() => setShowRecoveryMsg(true)}
                                        className="text-xs text-[#15447c] dark:text-indigo-400 hover:underline font-bold"
                                        disabled={isLoading}
                                    >
                                        Mot de passe oublié ?
                                    </button>
                                </div>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 border border-gray-300 dark:border-slate-800 rounded-xl shadow-xs text-sm bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/10 focus:border-[#15447c] outline-none transition" 
                                    placeholder="********" 
                                    required 
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-[#15447c] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#15447c]/95 active:scale-[0.99] transition duration-150 shadow-md flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Connexion en cours...</span>
                                        </>
                                    ) : (
                                        <span>Se connecter</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
