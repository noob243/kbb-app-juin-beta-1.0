import React, { FC, useState } from 'react';
import { ChatIcon } from '../components/Icons';
import { mockPersonnel, initialConversations } from '../data/mockData';

interface ForumReply {
    id: number;
    author: string;
    role: string;
    text: string;
    time: string;
    isMe?: boolean;
}

interface ForumTopic {
    id: number;
    title: string;
    category: 'Jurisprudence' | 'Administration' | 'Entraide' | 'Général';
    author: string;
    role: string;
    date: string;
    content: string;
    replies: ForumReply[];
}

interface ChatPageProps {
    avocats: any[];
    personnels: any[];
    currentUserInfo: { name: string; role: string; email: string } | null;
    presences: { [email: string]: any };
}

const defaultAdminsList = [
    { email: 'admin@cabinet.com', name: 'Administrateur Cabinet', role: 'Directeur Associé KBB' },
    { email: 'jeremieshusu4@gmail.com', name: 'Jérémie Shusu', role: 'Admin Principal' },
    { email: 'hervemich@icloud.com', name: 'Hervé Mich', role: 'Admin Principal' }
];

const ChatPage: FC<ChatPageProps> = ({ avocats, personnels, currentUserInfo, presences }) => {
    // Nav Tabs
    const [activeTab, setActiveTab] = useState<'direct' | 'forum'>('direct');

    // Get all registered users dynamically
    const getRegisteredUsers = () => {
        const usersMap = new Map<string, { name: string; role: string; email: string }>();

        // 1. Add default admins
        defaultAdminsList.forEach(admin => {
            usersMap.set(admin.email.toLowerCase().trim(), {
                name: admin.name,
                role: admin.role,
                email: admin.email.toLowerCase().trim()
            });
        });

        // 2. Add avocats
        if (avocats && Array.isArray(avocats)) {
            avocats.forEach(av => {
                const email = av.emails && av.emails[0] ? av.emails[0].toLowerCase().trim() : (av.email || '').toLowerCase().trim();
                if (email) {
                    usersMap.set(email, {
                        name: av.fullName,
                        role: av.cabinetRole || av.cabinetStatus || "Avocat",
                        email
                    });
                }
            });
        }

        // 3. Add personnels
        if (personnels && Array.isArray(personnels)) {
            personnels.forEach(p => {
                const email = (p.email || '').toLowerCase().trim();
                if (email) {
                    usersMap.set(email, {
                        name: p.fullName,
                        role: p.role || "Secrétaire",
                        email
                    });
                }
            });
        }

        // Convert map to array and add online status from presences prop
        return Array.from(usersMap.values()).map(user => {
            const presence = presences?.[user.email];
            const isOnline = presence?.status === 'online';
            return {
                ...user,
                status: isOnline ? 'online' : 'offline' as 'online' | 'offline'
            };
        });
    };

    const registeredUsers = getRegisteredUsers();

    // Helper to check user status by name
    const getUserStatusByName = (name: string): 'online' | 'offline' => {
        if (name === "Moi" || name === currentUserInfo?.name) {
            return 'online';
        }
        const user = registeredUsers.find(u => u.name.toLowerCase().trim() === name.toLowerCase().trim());
        return user?.status || 'offline';
    };

    // --- Direct Messages State ---
    const [selectedContact, setSelectedContact] = useState<{ name: string; role: string; email: string; status: 'online' | 'offline' } | null>(null);
    const [conversations, setConversations] = useState(initialConversations);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // --- Forum State ---
    const [forumSearchTerm, setForumSearchTerm] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Tous');
    const [isCreatingTopic, setIsCreatingTopic] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(1); // default to first topic

    // Create Topic Form State
    const [newTopicTitle, setNewTopicTitle] = useState('');
    const [newTopicCategory, setNewTopicCategory] = useState<'Jurisprudence' | 'Administration' | 'Entraide' | 'Général'>('Général');
    const [newTopicContent, setNewTopicContent] = useState('');

    // New Reply State
    const [newReplyText, setNewReplyText] = useState('');

    // Preloaded robust French-jurisprudential legal team topics State
    const [forumTopics, setForumTopics] = useState<ForumTopic[]>([
        {
            id: 1,
            title: "Nouvelle jurisprudence sur les licenciements collectifs",
            category: "Jurisprudence",
            author: "Jean-Luc Tshisekedi",
            role: "Avocat Associé",
            date: "28 Mai 2026, 10:15",
            content: "Chers confrères, avez-vous pris connaissance du dernier arrêt de la Cour de Cassation concernant les nouveaux barèmes d'indemnisation ? Cela pourrait impacter durablement notre dossier de défense pour Congo Invest SARL.",
            replies: [
                {
                    id: 101,
                    author: "Marie-Claire Mobutu",
                    role: "Avocate Collaboratrice",
                    text: "Oui, Jean-Luc. J'allais justement t'en parler. Cet arrêt clarifie que le barème ne s'applique pas en cas de violation caractérisée d'un droit fondamental.",
                    time: "Aujourd'hui à 11:30"
                },
                {
                    id: 102,
                    author: "Moi",
                    role: "Avocat(e) Titulaire",
                    text: "Je propose de rédiger et d'annexer une note de synthèse claire pour la joindre aux pièces de plaidoirie de Congo Invest.",
                    time: "Aujourd'hui à 14:15",
                    isMe: true
                },
                {
                    id: 103,
                    author: "Patrick Lumumba",
                    role: "Avocat Stagiaire",
                    text: "Excellente idée ! Je m'occupe dès ce soir d'imprimer l'arrêt complet de la Cour suprême et de surligner les attendus déterminants pour notre argumentaire.",
                    time: "Aujourd'hui à 15:45"
                }
            ]
        },
        {
            id: 2,
            title: "Projets de numérisation complète du Tribunal de Grande Instance (TGI)",
            category: "Administration",
            author: "Félicité Kanku",
            role: "Secrétaire Juridique",
            date: "27 Mai 2026, 09:12",
            content: "Bonjour à tous, le secrétariat du greffe a annoncé que le TGI va mettre en route sa nouvelle plateforme d'envoi d'actes dématérialisés dès le mois prochain. Une formation pratique d'une heure en visioconférence aura lieu ce vendredi à 10h pour faciliter l'adoption.",
            replies: [
                {
                    id: 201,
                    author: "Marie-Claire Mobutu",
                    role: "Avocate Collaboratrice",
                    text: "Merci Félicité d'avoir relayé cette information ! Je viens de m'inscrire. Ce guichet électronique va nous faire gagner un temps précieux lors des dépôts d'actes complémentaires.",
                    time: "Hier à 11:30"
                }
            ]
        },
        {
            id: 3,
            title: "Demande d'aide : Modèle de bail commercial OHADA",
            category: "Entraide",
            author: "Patrick Lumumba",
            role: "Avocat Stagiaire",
            date: "26 Mai 2026, 14:00",
            content: "Hello l'équipe, est-ce que quelqu'un aurait sous la main un exemple de contrat de bail commercial OHADA mis à jour avec la législation relative à la révision triennale des loyers réels ? C'est très urgent pour finaliser l'acte de BCC.",
            replies: [
                {
                    id: 301,
                    author: "Jean-Luc Tshisekedi",
                    role: "Avocat Associé",
                    text: "Patrick, consulte le sous-dossier partagé 'Modèles types > Actes'. J'y ai publié un modèle complet intégrant la jurisprudence OHADA sur l'indexation, validé le mois dernier.",
                    time: "26 Mai 2026 à 14:45"
                },
                {
                    id: 302,
                    author: "Patrick Lumumba",
                    role: "Avocat Stagiaire",
                    text: "Trouvé ! Merci infiniment maître, c'est parfaitement rédigé et cela me débloque entièrement.",
                    time: "26 Mai 2026 à 15:10"
                }
            ]
        }
    ]);

    // Send direct message action
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !selectedContact) return;

        const newMsg = {
            sender: 'me',
            text: newMessage,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };

        const contactName = selectedContact.name;
        const updatedConversation = [...(conversations[contactName] || []), newMsg];
        
        setConversations(prev => ({ ...prev, [contactName]: updatedConversation }));
        setNewMessage('');
    };

    // Post reply on forum
    const handlePostReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReplyText.trim() === '' || selectedTopicId === null) return;

        const updatedTopics = forumTopics.map(topic => {
            if (topic.id === selectedTopicId) {
                return {
                    ...topic,
                    replies: [
                        ...topic.replies,
                        {
                            id: Date.now(),
                            author: "Moi",
                            role: "Avocat(e) Titulaire",
                            text: newReplyText,
                            time: "À l'instant",
                            isMe: true
                        }
                    ]
                };
            }
            return topic;
        });

        setForumTopics(updatedTopics);
        setNewReplyText('');
    };

    // Create topic action
    const handleCreateTopic = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTopicTitle.trim() === '' || newTopicContent.trim() === '') return;

        const newTopic: ForumTopic = {
            id: Date.now(),
            title: newTopicTitle,
            category: newTopicCategory,
            author: "Moi",
            role: "Avocat(e) Titulaire",
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + `, ` + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            content: newTopicContent,
            replies: []
        };

        setForumTopics([newTopic, ...forumTopics]);
        setSelectedTopicId(newTopic.id);
        setIsCreatingTopic(false);
        setNewTopicTitle('');
        setNewTopicContent('');
        setNewTopicCategory('Général');
    };

    const filteredChatUsers = registeredUsers.filter(u => 
        u.email !== currentUserInfo?.email?.toLowerCase()?.trim() &&
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredForumTopics = forumTopics.filter(topic => {
        const matchesSearch = topic.title.toLowerCase().includes(forumSearchTerm.toLowerCase()) || 
                              topic.content.toLowerCase().includes(forumSearchTerm.toLowerCase()) ||
                              topic.author.toLowerCase().includes(forumSearchTerm.toLowerCase());
        const matchesCategory = selectedCategoryFilter === 'Tous' || topic.category === selectedCategoryFilter;
        return matchesSearch && matchesCategory;
    });

    const activeForumTopic = forumTopics.find(t => t.id === selectedTopicId) || null;

    const getCategoryBadgeClass = (category: string) => {
        switch (category) {
            case 'Jurisprudence': return 'bg-purple-55 bg-purple-100 text-purple-700 border-purple-200';
            case 'Administration': return 'bg-sky-55 bg-sky-100 text-sky-700 border-sky-200';
            case 'Entraide': return 'bg-amber-55 bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-indigo-55 bg-indigo-100 text-indigo-700 border-indigo-200';
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Page Header and Tab Switching Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Espace Communication
                </h1>

                {/* Main Tabs Changer */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab('direct');
                            setIsCreatingTopic(false);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'direct' ? 'bg-white shadow-sm text-indigo-750' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                        Messages Directs
                        <span className="bg-green-500 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                            {registeredUsers.filter(u => u.status === 'online').length}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('forum')}
                        className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'forum' ? 'bg-white shadow-sm text-indigo-750' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Forum du Cabinet
                        <span className="bg-indigo-600 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                            {forumTopics.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Content Area split wrapper with standard height */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex h-[620px] overflow-hidden">
                
                {/* 1. VIEW DIRECT MESSAGES */}
                {activeTab === 'direct' && (
                    <>
                        {/* Left Side: Collaborateurs list */}
                        <div className="w-full md:w-1/3 border-r border-gray-150 flex flex-col bg-slate-50/50">
                            <div className="p-4 border-b border-gray-150 bg-white">
                                <label className="block text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1.5">Discuter en privé</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Filtrer par avocat ou secrétaire..."
                                        className="w-full p-2.5 pl-9 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <svg className="absolute left-3 top-3.5 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            <ul className="overflow-y-auto flex-1 divide-y divide-slate-100">
                                {filteredChatUsers.map(person => (
                                     <li key={person.name}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedContact(person)}
                                            className={`w-full text-left p-4 hover:bg-slate-100/55 flex items-center justify-between transition-all duration-200 ${selectedContact?.name === person.name ? 'bg-indigo-50/70 border-l-4 border-indigo-650' : 'border-l-4 border-transparent'}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="relative flex-shrink-0">
                                                     <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                                                         {person.name.charAt(0)}
                                                     </div>
                                                     <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ${person.status === 'online' ? 'bg-green-500' : 'bg-slate-350'} ring-2 ring-white`}></span>
                                                </div>
                                               
                                                <div>
                                                     <p className={`text-xs font-bold leading-tight ${selectedContact?.name === person.name ? 'text-indigo-900' : 'text-slate-800'}`}>{person.name}</p>
                                                     <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{person.role}</p>
                                                </div>
                                            </div>
                                            
                                            {person.status === 'online' ? (
                                                <span className="text-[9px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-150 uppercase tracking-wide">
                                                    En ligne
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-semibold text-slate-400">
                                                    Hors ligne
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Side: Conversation stream */}
                        <div className="hidden md:flex md:w-2/3 flex-col bg-white">
                            {selectedContact ? (
                                <>
                                    {/* Selected Contact Header banner */}
                                    <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-slate-50/40">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-3xs">
                                                {selectedContact.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-slate-800">{selectedContact.name}</h2>
                                                <p className="text-[10px] text-gray-500 font-semibold flex items-center mt-0.5">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${selectedContact.status === 'online' ? 'bg-green-500' : 'bg-slate-400'} mr-1.5`}></span>
                                                    {selectedContact.status === 'online' ? 'Disponible pour échanger' : 'Actuellement absent(e)'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest bg-slate-100 border border-gray-200 px-2 py-1 rounded-md">
                                            Canal Sécurisé
                                        </div>
                                    </div>

                                    {/* Messages list */}
                                    <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 space-y-4">
                                        {(conversations[selectedContact.name] || []).map((msg, index) => (
                                            <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-xl border ${msg.sender === 'me' ? 'bg-indigo-600 text-white border-transparent shadow-3xs' : 'bg-white text-slate-850 border-gray-200 shadow-2xs'}`}>
                                                    <p className="text-xs leading-relaxed font-medium">{msg.text}</p>
                                                    <p className={`text-[9px] mt-1 font-semibold ${msg.sender === 'me' ? 'text-indigo-200' : 'text-slate-400'} text-right`}>{msg.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Private reply action form */}
                                    <div className="p-4 border-t border-gray-150 bg-white">
                                        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                placeholder={`Tapez votre réponse pour ${selectedContact.name.split(' ')[0]}...`}
                                                className="flex-1 p-3 bg-slate-55 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                            />
                                            <button type="submit" className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition duration-200 shadow-sm flex-shrink-0" title="Envoyer le message">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-500">
                                   <div className="text-center p-8 max-w-sm">
                                        <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border border-gray-150 text-indigo-500">
                                            <ChatIcon />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700 mt-4">Aucune conversation active</h3>
                                        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                                            Sélectionnez l'un de vos collègues avocats dans le menu de gauche pour démarrer un canal de discussion confidentiel.
                                        </p>
                                   </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* 2. VIEW FORUM OF DISCUSSIONS */}
                {activeTab === 'forum' && (
                    <>
                        {/* Left Subpanel: Threads index & filters */}
                        <div className="w-full md:w-1/3 border-r border-gray-150 flex flex-col bg-slate-50/50">
                            
                            {/* Thread Search, Category pills and Topic creator trigger */}
                            <div className="p-4 border-b border-gray-150 bg-white space-y-3 flex-shrink-0">
                                <div className="flex justify-between items-center">
                                    <label className="block text-[10px] font-black tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase">
                                        Thématiques
                                    </label>
                                    {!isCreatingTopic && (
                                        <button
                                            type="button"
                                            onClick={() => setIsCreatingTopic(true)}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1.2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-extrabold rounded-lg transition shadow-2xs"
                                        >
                                            <svg className="w-3.5 h-3.5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Nouveau sujet
                                        </button>
                                    )}
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Filtrer les sujets du forum..."
                                        className="w-full p-2.5 pl-9 border border-gray-255 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/40"
                                        value={forumSearchTerm}
                                        onChange={(e) => setForumSearchTerm(e.target.value)}
                                    />
                                    <svg className="absolute left-3 top-3.5 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                {/* Category Selection Horizontal Bar */}
                                <div className="flex flex-wrap gap-1 pt-1">
                                    {['Tous', 'Jurisprudence', 'Administration', 'Entraide'].map(pill => (
                                        <button
                                            key={pill}
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategoryFilter(pill);
                                                setIsCreatingTopic(false);
                                            }}
                                            className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all ${selectedCategoryFilter === pill ? 'bg-indigo-50 border-indigo-200 text-indigo-750' : 'bg-slate-50/50 hover:bg-gray-150 text-slate-500 border-gray-200'}`}
                                        >
                                            {pill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Topics Feed list */}
                            <ul className="overflow-y-auto flex-1 divide-y divide-slate-100">
                                {filteredForumTopics.length > 0 ? (
                                    filteredForumTopics.map(topic => (
                                        <li key={topic.id}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedTopicId(topic.id);
                                                    setIsCreatingTopic(false);
                                                }}
                                                className={`w-full text-left p-4 hover:bg-slate-100/55 flex flex-col justify-between transition-all duration-200 border-l-4 ${selectedTopicId === topic.id && !isCreatingTopic ? 'bg-indigo-50/75 border-indigo-650' : 'border-l-4 border-transparent'}`}
                                            >
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider ${getCategoryBadgeClass(topic.category)}`}>
                                                        {topic.category}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-semibold">{topic.date.split(',')[0]}</span>
                                                </div>

                                                <p className={`text-xs font-bold leading-normal tracking-tight line-clamp-2 ${selectedTopicId === topic.id && !isCreatingTopic ? 'text-indigo-900' : 'text-slate-800'}`}>
                                                    {topic.title}
                                                </p>

                                                <div className="flex items-center justify-between mt-3 text-[10px] text-gray-500 font-medium">
                                                    <span className="flex items-center gap-1.5 italic font-semibold text-slate-450">
                                                        Par {topic.author}
                                                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${getUserStatusByName(topic.author) === 'online' ? 'bg-green-500' : 'bg-slate-350'}`} title={getUserStatusByName(topic.author) === 'online' ? 'En ligne' : 'Hors ligne'}></span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5 bg-slate-100 px-1.5 py-0.5 rounded border border-gray-200/50">
                                                        <svg className="w-3.5 h-3.5 text-gray-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        <strong>{topic.replies.length}</strong> {topic.replies.length > 1 ? 'messes' : 'mess'}
                                                    </span>
                                                </div>
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-8 text-center text-gray-400 text-xs italic">
                                        Aucun sujet correspond à vos filtres
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Right Subpanel: Selected Active Thread Content OR Create Form */}
                        <div className="hidden md:flex md:w-2/3 flex-col bg-white">
                            
                            {/* Option A: Create Thread Mode */}
                            {isCreatingTopic ? (
                                <div className="p-6 flex flex-col h-full overflow-y-auto">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-150 mb-4 flex-shrink-0">
                                        <div>
                                            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">Créer un nouveau sujet sur le Forum</h2>
                                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Partagez vos interrogations, une veille de jurisprudence ou une demande d'assistance</p>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setIsCreatingTopic(false)}
                                            className="text-gray-400 hover:text-gray-700 font-bold text-lg transition"
                                        >
                                            &times;
                                        </button>
                                    </div>

                                    <form onSubmit={handleCreateTopic} className="space-y-4 flex-1">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nom du Sujet <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text"
                                                placeholder="Ex: Arrêt de cassation du 12 mai, question sur le barème indemnitaire..."
                                                className="w-full p-2.5 border border-gray-255 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                                                value={newTopicTitle}
                                                onChange={(e) => setNewTopicTitle(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Thème de discussion / Tag</label>
                                            <select
                                                className="w-full p-2.5 border border-gray-255 rounded-xl text-xs text-gray-700 font-semibold focus:ring-1 focus:ring-indigo-500"
                                                value={newTopicCategory}
                                                onChange={(e) => setNewTopicCategory(e.target.value as any)}
                                            >
                                                <option value="Général">Général - Échange libre</option>
                                                <option value="Jurisprudence">Jurisprudence - Veille & Décisions</option>
                                                <option value="Administration">Administration - Vie du Cabinet</option>
                                                <option value="Entraide">Entraide - Demande de conseils & partages</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Description / Contenu <span className="text-red-500">*</span></label>
                                            <textarea
                                                rows={5}
                                                placeholder="Rédigez ici le message d'introduction de votre sujet..."
                                                className="w-full p-3 border border-gray-255 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                                                value={newTopicContent}
                                                onChange={(e) => setNewTopicContent(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="flex gap-2 justify-end pt-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsCreatingTopic(false)}
                                                className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-5 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-2xs"
                                            >
                                                Publier le sujet
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : activeForumTopic ? (
                                <div className="flex flex-col h-full bg-white select-none">
                                    
                                    {/* Selected Thread Info Header */}
                                    <div className="p-4 border-b border-gray-150 bg-slate-50/40">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider ${getCategoryBadgeClass(activeForumTopic.category)}`}>
                                                Sujet : {activeForumTopic.category}
                                            </span>
                                            <span className="text-[10px] font-bold text-[#15447c] bg-[#15447c]/5 px-2 py-0.5 rounded-md">
                                                ID Thread: #{activeForumTopic.id.toString().slice(-4)}
                                            </span>
                                        </div>
                                        <h2 className="text-sm font-bold text-slate-800 leading-snug">{activeForumTopic.title}</h2>
                                    </div>

                                    {/* Original Thread Post & Conversations feed list wrapper */}
                                    <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/20">
                                        
                                        {/* Original Creator Post Box */}
                                        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-4.5 shadow-3xs relative">
                                            <div className="flex justify-between items-start mb-3 pb-2 border-b border-slate-100">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="relative">
                                                        <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-3xs">
                                                            {activeForumTopic.author.charAt(0)}
                                                        </div>
                                                        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${getUserStatusByName(activeForumTopic.author) === 'online' ? 'bg-green-500' : 'bg-slate-350'} ring-1 ring-white`}></span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                            {activeForumTopic.author}
                                                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${getUserStatusByName(activeForumTopic.author) === 'online' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                                {getUserStatusByName(activeForumTopic.author) === 'online' ? 'En ligne' : 'Hors ligne'}
                                                            </span>
                                                        </h3>
                                                        <p className="text-[9px] font-semibold text-slate-400">{activeForumTopic.role}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[9.5px] font-semibold text-slate-400">{activeForumTopic.date}</span>
                                            </div>
                                            <p className="text-xs text-slate-750 font-medium leading-relaxed whitespace-pre-line">{activeForumTopic.content}</p>
                                        </div>

                                        {/* Discussion separator label */}
                                        <div className="flex items-center gap-2 text-3xs font-black uppercase tracking-widest text-slate-400">
                                            <span className="h-px bg-gray-200 flex-1"></span>
                                            <span>Réponses ordonnées ({activeForumTopic.replies.length})</span>
                                            <span className="h-px bg-gray-200 flex-1"></span>
                                        </div>

                                        {/* Thread Replies */}
                                        {activeForumTopic.replies.length > 0 ? (
                                            <div className="space-y-3.5 pt-1">
                                                {activeForumTopic.replies.map(reply => (
                                                    <div key={reply.id} className="flex gap-3">
                                                        <div className="relative flex-shrink-0">
                                                            <div className={`w-7 h-7 rounded-full text-white font-bold text-2xs flex items-center justify-center uppercase shadow-3xs ${reply.isMe ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                                                                {reply.author.charAt(0)}
                                                            </div>
                                                            <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${getUserStatusByName(reply.author) === 'online' ? 'bg-green-500' : 'bg-slate-350'} ring-1 ring-white`}></span>
                                                        </div>
                                                        <div className={`flex-1 p-3.5 rounded-2xl border ${reply.isMe ? 'bg-indigo-50/30 border-indigo-200 shadow-3xs' : 'bg-white border-slate-200 shadow-2xs'}`}>
                                                            <div className="flex justify-between items-center mb-1 pb-1 border-b border-gray-100/50">
                                                                <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
                                                                    {reply.author} 
                                                                    <span className="text-[9px] font-semibold text-slate-400">({reply.role})</span>
                                                                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded-full ${getUserStatusByName(reply.author) === 'online' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                                        {getUserStatusByName(reply.author) === 'online' ? 'en ligne' : 'hors ligne'}
                                                                    </span>
                                                                </span>
                                                                <span className="text-[9px] text-gray-400 font-medium">{reply.time}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                                                                {reply.text}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center bg-white border border-dashed border-gray-200 rounded-xl">
                                                <p className="text-xs text-slate-450 italic">Aucune réponse pour le moment sur ce sujet. Prenez la parole en complétant le formulaire ci-dessous !</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Reply area form */}
                                    <div className="p-4 border-t border-gray-150 bg-white">
                                        <form onSubmit={handlePostReply} className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                placeholder="Participer à la discussion en publiant votre avis..."
                                                className="flex-1 p-3 bg-slate-55 border border-gray-255 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                                                value={newReplyText}
                                                onChange={(e) => setNewReplyText(e.target.value)}
                                            />
                                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition duration-250 shadow-sm flex-shrink-0" title="Publier ma réponse">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-500">
                                   <div className="text-center p-8 max-w-sm">
                                        <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-150 text-indigo-500">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-705 mt-4">Sélectionnez un sujet</h3>
                                        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                                            Sélectionnez l'une des thématiques de veille du cabinet ou d'entraide répertoriée à gauche, ou cliquez sur "Nouveau sujet" pour démarrer une autre discussion collective.
                                        </p>
                                   </div>
                                </div>
                            )}

                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default ChatPage;
