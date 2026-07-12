
import { Client, Case, Event, Avocat, Task, Invoice, Personnel, Fournisseur } from '../types';

export const initialClients: Client[] = [
  { id: 1, name: 'Congo Invest SARL', contact: 'Alain Mabiala', cases: 2 },
  { id: 2, name: 'Kinshasa Digital Solutions', contact: 'Pascaline Bongo', cases: 1 },
  { id: 3, name: 'Bâtir Congo Construction', contact: 'Christine Okito', cases: 5 },
  { id: 4, name: 'Saveurs du Fleuve', contact: 'Chantal Biya', cases: 0 },
];

export const initialCases: Case[] = [
  { id: 'CI-2023-001', name: 'Litige commercial', client: 'Congo Invest SARL', status: 'En cours', nextHearing: '2024-09-15', notes: 'Dossier complexe concernant un désaccord de facturation de prestations avec un sous-traitant. En attente de pièces comptables complémentaires.' },
  { id: 'KDS-2023-012', name: 'Dépôt de brevet', client: 'Kinshasa Digital Solutions', status: 'En attente', nextHearing: null, notes: 'Dépôt de marque et brevet technologique en cours d\'examen auprès de l\'ANAPI.' },
  { id: 'BCC-2022-050', name: 'Contentieux immobilier', client: 'Bâtir Congo Construction', status: 'Clôturé', nextHearing: null, notes: 'Litige foncier résolu par ordonnance de référé favorable. Frais de justice entièrement recouvrés.' },
  { id: 'CI-2023-002', name: 'Recouvrement de créances', client: 'Congo Invest SARL', status: 'En cours', nextHearing: '2024-10-02', notes: 'Mise en demeure infructueuse. Procédure d\'injonction de payer lancée.' },
];

export const initialEvents: Event[] = [
    { id: 'ATL-LC-01', name: 'Atelier d\'échanges: Litige commercial', type: 'Atelier', date: '2024-09-15', lieu: 'Tribunal de Commerce' },
    { id: 'ATL-RC-02', name: 'Atelier pratique: Recouvrement de créances', type: 'Atelier', date: '2024-10-02', lieu: 'Tribunal Judiciaire' },
    { id: 'CONF-DA-01', name: 'Conférence sur le Droit des Affaires', type: 'Conférence', date: '2024-11-20', lieu: 'Palais des Congrès' },
    { id: 'COL-PI-01', name: 'Colloque: Propriété Intellectuelle', type: 'Colloque', date: '2024-12-05', lieu: 'Université de Kinshasa' },
];

export const initialAvocats: Avocat[] = [
    { id: 'JLT-01', fullName: 'Jean-Luc Tshisekedi', photo: null, photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face', firstOathDate: '2010-01-15', secondOathDate: '', onaNumber: 'ONA-12345', cabinetStatus: 'Associé', serviceStartDate: '2012-09-01', serviceStatus: 'Actif', cabinetRole: 'Avocat Associé', phone: '0812345678', emails: ['jl.tshisekedi@cabinet.com'], disciplinaryMeasures: 'Aucune mesure à signaler.', mainBar: 'Kinshasa-Gombe', secondaryBar: 'Hauts-Plateaux' },
    { id: 'MCM-02', fullName: 'Marie-Claire Mobutu', photo: null, photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face', firstOathDate: '2018-05-20', secondOathDate: '', onaNumber: 'ONA-67890', cabinetStatus: 'Senior', serviceStartDate: '2020-01-10', serviceStatus: 'Actif', cabinetRole: 'Avocate Collaboratrice', phone: '0887654321', emails: ['mc.mobutu@cabinet.com'], disciplinaryMeasures: '', mainBar: 'Haut Katanga', secondaryBar: '' },
    { id: 'PL-03', fullName: 'Patrick Lumumba', photo: null, photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face', firstOathDate: '2022-07-01', secondOathDate: '', onaNumber: 'ONA-11223', cabinetStatus: 'Junior', serviceStartDate: '2023-09-01', serviceStatus: 'Actif', cabinetRole: 'Avocat Stagiaire', phone: '0811223344', emails: ['p.lumumba@cabinet.com'], disciplinaryMeasures: '', mainBar: 'Kinshasa-Matete', secondaryBar: 'Kongo Central' },
];


export const initialTasks: Task[] = [
  { id: 1, name: 'Rédiger conclusions pour Congo Invest', caseId: 'CI-2023-001', lawyer: 'Jean-Luc Tshisekedi', dueDate: '2024-09-25', status: 'Non effectué' },
  { id: 2, name: 'Préparer audience Kinshasa Digital', caseId: 'KDS-2023-012', lawyer: 'Marie-Claire Mobutu', dueDate: '2024-10-10', status: 'Effectué à moitié' },
  { id: 3, name: 'Rechercher jurisprudence Bâtir Congo', caseId: 'BCC-2022-050', lawyer: 'Patrick Lumumba', dueDate: '2024-09-30', status: 'Effectué' },
];

export const mockPersonnel = [
    { name: 'Jean-Luc Tshisekedi', role: 'Avocat Associé', status: 'online' },
    { name: 'Marie-Claire Mobutu', role: 'Avocate Collaboratrice', status: 'online' },
    { name: 'Patrick Lumumba', role: 'Avocat Stagiaire', status: 'offline' },
    { name: 'Félicité Kanku', role: 'Secrétaire Juridique', status: 'online' },
    { name: 'Didier Mbenga', role: 'Comptable', status: 'offline' },
];

export const initialConversations: { [key: string]: { sender: string; text: string; time: string }[] } = {
    'Jean-Luc Tshisekedi': [
        { sender: 'Jean-Luc Tshisekedi', text: 'Bonjour, as-tu pu regarder le dossier Congo Invest SARL ?', time: '10:30' },
        { sender: 'me', text: 'Oui, je suis dessus. Je te fais un retour avant midi.', time: '10:31' },
    ],
    'Marie-Claire Mobutu': [
         { sender: 'Marie-Claire Mobutu', text: 'N\'oublie pas l\'audience de 14h pour Kinshasa Digital Solutions.', time: '09:15' },
    ],
};

export const initialInvoices: Invoice[] = [
    { id: 'FACT-CI001-01', caseId: 'CI-2023-001', dueDate: '2024-09-30', totalAmount: 2500, paidAmount: 2500, status: 'Réglée', etiquette: 'Honoraires de Conseil' },
    { id: 'FACT-KDS012-01', caseId: 'KDS-2023-012', dueDate: '2024-10-15', totalAmount: 5000, paidAmount: 1000, status: 'En cours', etiquette: 'Suivi contentieux fiscal' },
    { id: 'FACT-CI002-01', caseId: 'CI-2023-002', dueDate: '2024-10-20', totalAmount: 1200, paidAmount: 0, status: 'Non réglée', etiquette: 'Rédaction Contrat de Travail' },
];

export const initialPersonnels: Personnel[] = [
    { 
        id: 'PERS-01', 
        fullName: 'Félicité Kanku', 
        role: 'Secrétaire', 
        email: 'f.kanku@cabinet.com', 
        phone: '0815551234', 
        serviceStartDate: '2021-03-15', 
        serviceStatus: 'Actif',
        salary: 850,
        maritalStatus: 'Marié(e)',
        hasChildren: 'Oui',
        childrenCount: 2,
        address: 'Av. de la Gombe 12, Kinshasa/Gombe',
        photo: '',
        disciplinaryMeasure: 'Aucune',
        disciplinaryStatus: 'Aucune'
    },
    { 
        id: 'PERS-02', 
        fullName: 'Didier Mbenga', 
        role: 'Assistant de direction', 
        email: 'd.mbenga@cabinet.com', 
        phone: '0815555678', 
        serviceStartDate: '2019-11-01', 
        serviceStatus: 'Actif',
        salary: 1200,
        maritalStatus: 'Célibataire',
        hasChildren: 'Non',
        childrenCount: 0,
        address: 'Bld du 30 Juin 45, Kinshasa/Gombe',
        photo: '',
        disciplinaryMeasure: 'Aucune',
        disciplinaryStatus: 'Aucune'
    },
    { 
        id: 'PERS-03', 
        fullName: 'Arsène Lupungu', 
        role: 'Intendant', 
        email: 'a.lupungu@cabinet.com', 
        phone: '0815559012', 
        serviceStartDate: '2023-05-10', 
        serviceStatus: 'Actif',
        salary: 600,
        maritalStatus: 'Célibataire',
        hasChildren: 'Non',
        childrenCount: 0,
        address: 'Av. Kisangani 104, Kinshasa/Lingwala',
        photo: '',
        disciplinaryMeasure: 'Avertissement écrit pour retards injustifiés',
        disciplinaryStatus: 'En cours'
    },
];

export const initialFournisseurs: Fournisseur[] = [
    {
        id: 'F-1',
        nomComplet: 'Congo Telecom Services',
        naturePrestation: 'Services',
        designationPrestation: 'Abonnement Internet Fibre Optique Haute Performance',
        typeFacturation: 'Périodique',
        periode: 'mensuel',
        montant: 250,
        adressePhysique: 'Boulevard du 30 Juin, Immeuble CCI, Gombe, Kinshasa',
        adresseMail: 'contact@congotel.cd',
        dirigeantPrincipal: 'Augustin Kabeya',
        referents: [
            { nom: 'Marc Maputa', phone: '0812233445', email: 'm.maputa@congotel.cd' },
            { nom: 'Sarah Mbiya', phone: '0898877665', email: 's.mbiya@congotel.cd' }
        ]
    },
    {
        id: 'F-2',
        nomComplet: 'Papeterie Moderne du Centre',
        naturePrestation: 'Bien',
        designationPrestation: 'Fournitures de bureau, papier d\'impression et consommables',
        typeFacturation: 'Ponctuelle',
        montant: 450,
        adressePhysique: 'Avenue de l\'Équateur, Kinshasa/Gombe',
        adresseMail: 'commandes@papeteriemoderne.cd',
        dirigeantPrincipal: 'Félix Muteba',
        referents: [
            { nom: 'Gisèle Ndolo', phone: '0821122334', email: 'g.ndolo@papeteriemoderne.cd' }
        ]
    },
    {
        id: 'F-3',
        nomComplet: 'Securitas RDC',
        naturePrestation: 'Services',
        designationPrestation: 'Gardiennage et système d\'alarme du cabinet',
        typeFacturation: 'Périodique',
        periode: 'trimestriel',
        montant: 1800,
        adressePhysique: 'Avenue du Flambeau, Zone Industrielle, Kinshasa',
        adresseMail: 'info@securitas.cd',
        dirigeantPrincipal: 'John Smith',
        referents: [
            { nom: 'Capitaine Jean Lelo', phone: '0854433221', email: 'j.lelo@securitas.cd' }
        ]
    }
];

export const initialProcedures: CaseProcedure[] = [
    {
        id: 'PROC-1',
        name: 'Référé-provision',
        instance: 'Tribunal de Commerce de Kinshasa',
        objet: 'Recouvrement de créances',
        dateDebut: '2024-01-10',
        status: 'En cours',
        linkedCases: ['CI-2023-001']
    },
    {
        id: 'PROC-2',
        name: 'Assignation au fond',
        instance: 'TGI Kinshasa/Gombe',
        objet: 'Litige immobilier',
        dateDebut: '2023-11-05',
        status: 'En attente',
        linkedCases: ['BCC-2022-050']
    }
];


