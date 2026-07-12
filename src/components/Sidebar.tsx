
import React, { FC, useState, useEffect } from 'react';
import { Icon, DashboardIcon, ClientsIcon, CasesIcon, EventsIcon, AgendaIcon, ChatIcon, BillingIcon, AvocatsIcon, StaffIcon, PersonnelsIcon, SuppliersIcon, LogoutIcon, EyeIcon, AIIcon } from './Icons';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
  currentUserInfo?: { name: string; role: string; email: string } | null;
}

const Sidebar: FC<SidebarProps> = ({ currentPage, setCurrentPage, onLogout, currentUserInfo }) => {
    const [isAgendaExpanded, setIsAgendaExpanded] = useState(
        currentPage === 'Agenda' || currentPage === 'Evenements'
    );

    useEffect(() => {
        if (currentPage === 'Agenda' || currentPage === 'Evenements') {
            setIsAgendaExpanded(true);
        }
    }, [currentPage]);

    const navItems = [
        { name: 'All', icon: <EyeIcon />, label: "Toutes les interfaces" },
        { name: 'Dashboard', icon: <DashboardIcon />, label: "Tableau de bord" },
        { name: 'AIAssistant', icon: <AIIcon />, label: "Otshudi AI" },
        { name: 'Clients', icon: <ClientsIcon />, label: "Clients" },
        { name: 'Dossiers', icon: <CasesIcon />, label: "Dossiers" },
        { name: 'Procedures', icon: <svg className="w-5 h-5 text-indigo-400 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>, label: "Procédures" },
        { 
            name: 'AgendaGroup', 
            icon: <AgendaIcon />, 
            label: "Agenda", 
            isGroup: true,
            subItems: [
                { 
                    name: 'Agenda', 
                    icon: (
                        <svg className="w-4 h-4 text-indigo-400 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    ), 
                    label: "Tâches" 
                },
                { 
                    name: 'Evenements', 
                    icon: (
                        <svg className="w-4 h-4 text-indigo-400 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    ), 
                    label: "Événements" 
                }
            ]
        },
        { name: 'Chat', icon: <ChatIcon />, label: "Chat" },
        { name: 'Correspondance', icon: <svg className="w-5 h-5 text-indigo-400 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, label: "Correspondance" },
        { name: 'Facturation', icon: <BillingIcon />, label: "Facturation" },
        { name: 'Avocats', icon: <AvocatsIcon />, label: "Avocats" },
        { name: 'Personnels', icon: <PersonnelsIcon />, label: "Personnels" },
        { name: 'Fournisseurs', icon: <SuppliersIcon />, label: "Fournisseurs" },
        { name: 'Gestion', icon: <StaffIcon />, label: "Gestion" },
        { 
          name: 'AuditLogs', 
          icon: (
            <svg className="w-5 h-5 text-indigo-400 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ), 
          label: "Journal d'audit" 
        }
    ];

    const isAssocietOrAdmin = () => {
        if (!currentUserInfo) return false;
        const role = currentUserInfo.role.toLowerCase();
        return role.includes('associé') || role.includes('partner') || role.includes('associet') || role.includes('directeur') || role.includes('admin');
    };

    const restrictedPages = ['Facturation', 'Gestion', 'AuditLogs'];

    return (
        <aside className="bg-[#15447c] text-slate-100 w-64 space-y-2 p-4 flex flex-col">
            <div className="text-2xl font-bold mb-6 flex items-center p-2">
                <svg className="w-8 h-8 mr-2 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
                <span>KBB App</span>
            </div>
            <nav className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                {navItems.map(item => {
                    if (item.isGroup) {
                        const isSelectedGroup = currentPage === 'Agenda' || currentPage === 'Evenements';
                        return (
                            <div key={item.name} className="space-y-1">
                                <button
                                    onClick={() => setIsAgendaExpanded(!isAgendaExpanded)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isSelectedGroup ? 'bg-black/20 text-white font-semibold' : 'text-slate-300 hover:bg-black/20 hover:text-white'}`}
                                >
                                    <div className="flex items-center">
                                        <Icon>{item.icon}</Icon>
                                        <span className="ml-3">{item.label}</span>
                                    </div>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${isAgendaExpanded ? 'rotate-90' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                
                                {isAgendaExpanded && item.subItems && (
                                    <div className="pl-4 space-y-1 mt-1 border-l border-white/10 ml-6">
                                        {item.subItems.map(subItem => (
                                            <a
                                                key={subItem.name}
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); setCurrentPage(subItem.name); }}
                                                className={`flex items-center px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${currentPage === subItem.name ? 'bg-white/10 text-white italic font-bold' : 'text-slate-300 hover:bg-black/10 hover:text-white'}`}
                                            >
                                                <span className="mr-2 text-sm">{subItem.icon}</span>
                                                <span>{subItem.label}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    const isRestricted = restrictedPages.includes(item.name) && !isAssocietOrAdmin();

                    return (
                        <a
                            key={item.name}
                            href="#"
                            onClick={(e) => { e.preventDefault(); setCurrentPage(item.name); }}
                            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === item.name ? 'bg-black/20 text-white' : 'text-slate-300 hover:bg-black/20 hover:text-white'}`}
                        >
                            <Icon>{item.icon}</Icon>
                            <span>{item.label}</span>
                            {isRestricted && (
                                <span className="ml-auto text-amber-400 bg-white/5 p-1 rounded-md" title="Accès réservé aux associés">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </span>
                            )}
                        </a>
                    );
                })}
            </nav>
            <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
                {currentUserInfo && (
                    <div className="px-4 py-3 bg-black/15 rounded-xl flex items-center gap-3 border border-white/5 shadow-inner">
                        <div className="w-9 h-9 rounded-full bg-[#15447c]/30 border border-white/20 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-xs">
                            {currentUserInfo.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate leading-tight" title={currentUserInfo.name}>{currentUserInfo.name}</p>
                            <p className="text-[10px] text-slate-350 truncate leading-tight mt-0.5" title={currentUserInfo.role}>{currentUserInfo.role}</p>
                        </div>
                    </div>
                )}
                 <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-black/20 hover:text-white transition-colors duration-200">
                    <Icon><LogoutIcon /></Icon>
                    <span>Déconnexion</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
