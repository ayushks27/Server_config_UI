// Define available apps with their data
export const AVAILABLE_APPS = [
  { id: 'canvas', name: 'Canvas', icon: '🎨', category: 'Applications' },
  { id: 'splital', name: 'Splital', icon: '🔄', category: 'Applications' },
  { id: 'google_maps', name: 'Google Maps', icon: '🗺️', category: 'Other Apps' },
  { id: 'canva', name: 'Canva', icon: '🖼️', category: 'Other Apps' },
  { id: 'share_point', name: 'Share Point', icon: '📁', category: 'Other Apps' },
  { id: 'composio', name: 'Composio', icon: '🔌', category: 'Other Apps' },
  { id: 'pdf', name: 'Text to PDF', icon: '📄', category: 'Other Apps' },
  { id: 'docusign', name: 'Docusign', icon: '✍️', category: 'Other Apps' },
  { id: 'sentry', name: 'Sentry', icon: '🚨', category: 'Other Apps' },
  { id: 'bitbucket', name: 'Bitbucket', icon: '📦', category: 'Other Apps' },
  { id: 'weathermap', name: 'Weathermap', icon: '☁️', category: 'Other Apps' },
];

// Define tools available for each app
export const APP_TOOLS: Record<string, Array<{ id: string; name: string; category: string }>> = {
  canvas: [
    { id: 'list_courses', name: 'List Courses', category: 'Important' },
    { id: 'get_all_assignments', name: 'Get All Assignments', category: 'Important' },
    { id: 'get_current_user', name: 'Get Current User', category: 'Important' },
    { id: 'create_course', name: 'Create Course', category: 'Important' },
    { id: 'update_course_settings', name: 'Update Course Settings', category: 'Important' },
    { id: 'create_assignment', name: 'Create Assignment', category: 'Courses' },
    { id: 'update_assignment', name: 'Update Assignment', category: 'Courses' },
    { id: 'delete_assignment', name: 'Delete Assignment', category: 'Courses' },
    { id: 'submit_assignment', name: 'Submit Assignment', category: 'Assignments' },
    { id: 'grade_assignment', name: 'Grade Assignment', category: 'Assignments' },
    { id: 'get_submissions', name: 'Get Submissions', category: 'Submissions' },
    { id: 'create_user', name: 'Create User', category: 'Users' },
    { id: 'update_user', name: 'Update User', category: 'Users' },
    { id: 'delete_user', name: 'Delete User', category: 'Users' },
  ],
  google_maps: [
    { id: 'geocode', name: 'Geocode Address', category: 'Location' },
    { id: 'directions', name: 'Get Directions', category: 'Location' },
    { id: 'places', name: 'Search Places', category: 'Places' },
  ],
  splital: [
    { id: 'split_text', name: 'Split Text', category: 'Text' },
    { id: 'merge_text', name: 'Merge Text', category: 'Text' },
    { id: 'analyze_text', name: 'Analyze Text', category: 'Analysis' },
  ],
  canva: [
    { id: 'create_design', name: 'Create Design', category: 'Design' },
    { id: 'get_templates', name: 'Get Templates', category: 'Design' },
    { id: 'export_design', name: 'Export Design', category: 'Export' },
  ],
  share_point: [
    { id: 'upload_file', name: 'Upload File', category: 'Files' },
    { id: 'download_file', name: 'Download File', category: 'Files' },
    { id: 'share_file', name: 'Share File', category: 'Sharing' },
  ],
  composio: [
    { id: 'create_component', name: 'Create Component', category: 'Components' },
    { id: 'update_component', name: 'Update Component', category: 'Components' },
    { id: 'publish_component', name: 'Publish Component', category: 'Publishing' },
  ],
  pdf: [
    { id: 'convert_to_pdf', name: 'Convert to PDF', category: 'Conversion' },
    { id: 'merge_pdfs', name: 'Merge PDFs', category: 'Management' },
    { id: 'split_pdf', name: 'Split PDF', category: 'Management' },
  ],
  docusign: [
    { id: 'send_for_signature', name: 'Send for Signature', category: 'Signatures' },
    { id: 'check_status', name: 'Check Status', category: 'Management' },
    { id: 'download_signed', name: 'Download Signed Document', category: 'Documents' },
  ],
  sentry: [
    { id: 'track_error', name: 'Track Error', category: 'Monitoring' },
    { id: 'create_issue', name: 'Create Issue', category: 'Issues' },
    { id: 'resolve_issue', name: 'Resolve Issue', category: 'Issues' },
  ],
  bitbucket: [
    { id: 'create_repo', name: 'Create Repository', category: 'Repositories' },
    { id: 'create_pr', name: 'Create Pull Request', category: 'PRs' },
    { id: 'merge_pr', name: 'Merge Pull Request', category: 'PRs' },
  ],
  weathermap: [
    { id: 'get_forecast', name: 'Get Forecast', category: 'Weather' },
    { id: 'get_current', name: 'Get Current Weather', category: 'Weather' },
    { id: 'get_alerts', name: 'Get Weather Alerts', category: 'Alerts' },
  ],
};
