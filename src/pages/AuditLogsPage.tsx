import React, { FC, useState, useMemo } from 'react';
import PageContainer from '../components/PageContainer';
import { 
  Activity, 
  Trash2, 
  PlusCircle, 
  Edit, 
  LogIn, 
  Search, 
  Filter, 
  Calendar, 
  FileSpreadsheet, 
  User, 
  Clock,
  Briefcase,
  Layers,
  HelpCircle
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsPageProps {
  logs: AuditLog[];
  onClearLogs?: () => void; // Optional if ever needed
}

const AuditLogsPage: FC<AuditLogsPageProps> = ({ logs = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState<string>('all');
    const [moduleFilter, setModuleFilter] = useState<string>('all');
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    // Format ISO timestamp to a friendly French string
    const formatTimestamp = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return new Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(date);
        } catch {
            return isoString;
        }
    };

    // Derived statistics
    const stats = useMemo(() => {
        const total = logs.length;
        const additions = logs.filter(l => l.actionType === 'Ajout').length;
        const deletions = logs.filter(l => l.actionType === 'Suppression').length;
        const modifications = logs.filter(l => l.actionType === 'Modification').length;
        
        // Active users set
        const uniqueUsers = new Set(logs.map(l => l.userEmail)).size;

        return { total, additions, deletions, modifications, uniqueUsers };
    }, [logs]);

    // Unique modules in existing logs for dynamic filtering
    const modules = useMemo(() => {
        const set = new Set<string>();
        logs.forEach(l => {
            if (l.module) set.add(l.module);
        });
        return Array.from(set);
    }, [logs]);

    // Filtered logs
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch = 
                log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.module.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesAction = actionFilter === 'all' || log.actionType === actionFilter;
            const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;

            return matchesSearch && matchesAction && matchesModule;
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [logs, searchQuery, actionFilter, moduleFilter]);

    // Icon helper for action types
    const getActionIcon = (actionType: string) => {
        switch (actionType) {
            case 'Ajout':
                return <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
            case 'Suppression':
                return <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
            case 'Modification':
                return <Edit className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
            case 'Connexion':
                return <LogIn className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
            default:
                return <Activity className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
        }
    };

    // Badge color helper
    const getActionBadgeClass = (actionType: string) => {
        switch (actionType) {
            case 'Ajout':
                return 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
            case 'Suppression':
                return 'bg-rose-50 dark:bg-rose-950/25 text-rose-800 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30';
            case 'Modification':
                return 'bg-amber-50 dark:bg-amber-950/25 text-amber-800 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
            case 'Connexion':
                return 'bg-indigo-50 dark:bg-indigo-950/25 text-indigo-800 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30';
            default:
                return 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 border border-slate-100 dark:border-slate-800';
        }
    };

    return (
        <PageContainer>
            {/* Header section with page title & description */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-[#15447c] dark:text-indigo-400 rounded-xl">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-slate-50 tracking-tight">
                            Journal d'Audit
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 font-medium">
                        Historique complet et traçabilité de toutes les actions effectuées dans l'application.
                    </p>
                </div>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-white dark:bg-[#0c111d] p-5 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-[#15447c] dark:text-indigo-400 rounded-xl">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Total Actions</p>
                        <p className="text-xl font-black text-gray-850 dark:text-slate-100 mt-0.5">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0c111d] p-5 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <PlusCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Ajouts</p>
                        <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.additions}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0c111d] p-5 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl">
                        <Edit className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Modifications</p>
                        <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{stats.modifications}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0c111d] p-5 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl">
                        <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Suppressions</p>
                        <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{stats.deletions}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0c111d] p-5 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Utilisateurs Actifs</p>
                        <p className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">{stats.uniqueUsers}</p>
                    </div>
                </div>
            </div>

            {/* Filter controls bar */}
            <div className="bg-white dark:bg-[#0c111d] p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    {/* Search bar */}
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par action, utilisateur, description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-gray-700 dark:text-slate-250 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-[#15447c] transition-all"
                        />
                    </div>

                    {/* Filters dropdowns */}
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-400">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Filtrer par :</span>
                        </div>

                        {/* Action Filter */}
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl text-gray-700 dark:text-slate-350 outline-none focus:ring-2 focus:ring-indigo-500/10"
                        >
                            <option value="all">Tous les types d'action</option>
                            <option value="Ajout">Ajout</option>
                            <option value="Modification">Modification</option>
                            <option value="Suppression">Suppression</option>
                            <option value="Connexion">Connexion</option>
                            <option value="Autre">Autre</option>
                        </select>

                        {/* Module Filter */}
                        <select
                            value={moduleFilter}
                            onChange={(e) => setModuleFilter(e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl text-gray-700 dark:text-slate-350 outline-none focus:ring-2 focus:ring-indigo-500/10"
                        >
                            <option value="all">Tous les modules</option>
                            {modules.map(mod => (
                                <option key={mod} value={mod}>{mod}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* List Table container */}
            <div className="bg-white dark:bg-[#0c111d] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                                <th className="px-6 py-4.5 text-3xs font-black tracking-widest text-gray-400 dark:text-slate-500 uppercase">Horodatage</th>
                                <th className="px-6 py-4.5 text-3xs font-black tracking-widest text-gray-400 dark:text-slate-500 uppercase">Utilisateur</th>
                                <th className="px-6 py-4.5 text-3xs font-black tracking-widest text-gray-400 dark:text-slate-500 uppercase">Action</th>
                                <th className="px-6 py-4.5 text-3xs font-black tracking-widest text-gray-400 dark:text-slate-500 uppercase">Module</th>
                                <th className="px-6 py-4.5 text-3xs font-black tracking-widest text-gray-400 dark:text-slate-500 uppercase">Description</th>
                                <th className="px-6 py-4.5 text-3xs font-black tracking-widest text-gray-400 dark:text-slate-500 uppercase text-right">Détails</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <tr 
                                        key={log.id} 
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition cursor-pointer"
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">{formatTimestamp(log.timestamp)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-100/60 dark:border-indigo-950">
                                                    {log.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-gray-800 dark:text-slate-200 truncate">{log.userName}</p>
                                                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{log.userEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-3xs font-extrabold rounded-md uppercase tracking-wider ${getActionBadgeClass(log.actionType)}`}>
                                                {getActionIcon(log.actionType)}
                                                <span>{log.actionType}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100/40 dark:border-indigo-900/20 px-2 py-0.5 rounded-md">
                                                {log.module}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-sm">
                                            <p className="text-xs font-medium text-gray-600 dark:text-slate-300 truncate" title={log.description}>
                                                {log.description}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setSelectedLog(log); }}
                                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                                            >
                                                Visualiser
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-3 bg-slate-50 dark:bg-slate-900 text-gray-400 dark:text-slate-500 rounded-2xl border border-slate-100 dark:border-slate-800 mb-3">
                                                <Search className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-700 dark:text-slate-350">Aucun log enregistré</p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Aucune action correspondante n'a été répertoriée dans le journal d'audit.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed Log modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Backdrop overlay */}
                        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity" onClick={() => setSelectedLog(null)}></div>

                        {/* Centering spacer */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal content box */}
                        <div className="inline-block align-bottom bg-white dark:bg-[#0c111d] rounded-2xl border border-gray-100 dark:border-slate-800 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded-lg">
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-800 dark:text-slate-100 uppercase tracking-wider">
                                        Détails de l'Action
                                    </h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedLog(null)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition rounded-lg"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Type d'Action</p>
                                        <div className="mt-1.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-3xs font-black rounded-md uppercase tracking-widest ${getActionBadgeClass(selectedLog.actionType)}`}>
                                                {getActionIcon(selectedLog.actionType)}
                                                <span>{selectedLog.actionType}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Module</p>
                                        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mt-1">{selectedLog.module}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                                    <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500">
                                        <User className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Auteur de l'action</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 dark:text-slate-200">{selectedLog.userName}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{selectedLog.userEmail}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                                    <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Date & Heure</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-800 dark:text-slate-200">{formatTimestamp(selectedLog.timestamp)}</p>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                                    <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500">
                                        <HelpCircle className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Description de l'événement</span>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 leading-relaxed">
                                        {selectedLog.description}
                                    </p>
                                </div>

                                {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Données techniques associées</span>
                                        <pre className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800/80 max-h-40 overflow-y-auto leading-normal">
                                            {JSON.stringify(selectedLog.details, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="px-4 py-2 bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 text-xs font-bold text-gray-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default AuditLogsPage;
