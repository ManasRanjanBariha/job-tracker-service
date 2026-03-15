import jetPaths from 'jet-paths';

const Paths = {
  _: '/api',
  auth:{
    _: '/auth',
    Login: '/login',
    Register: '/register',
    Logout: '/logout',
    Refresh: '/refresh',
  },
  JobApplications:{
    _: '/applications',
    GetAll: '/all',
    Add: '/add',
    GetOne: '/:id',
    Update: '/update/:id',
    Delete: '/delete/:id',
    changeStage: '/stage/:id',
    uploadResume: '/:id/upload-resume',
    uploadDocuments: '/:id/upload-documents',
  },
  Users: {
    _: '/users',
    GetAll: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  documents: {
    _: '/documents',
    GetAll: '/all',
    GetByApplicationId: '/application/:applicationId',
    Upload: '/:applicationId',
    GetOne: '/:id',
    Delete: '/:id',
  },
  stats:{
    _: '/stats',
    overview: '/overview',
    funnel: '/funnel',
    responseRate: '/response-rate',
    timelline: '/timeline',
  }
} as const;

export const JetPaths = jetPaths(Paths);
export default Paths;
