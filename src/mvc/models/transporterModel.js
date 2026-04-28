// File responsibility: Re-exports the data-access functions used by the MVC controllers.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

export {
  getTransporterProfile,
  updateTransporterProfile,
  getDeliveryRequests,
  getActiveDeliveries,
  getDeliveryById,
  acceptMission,
  declineMission,
  updateDeliveryStatus,
} from '../../services/transporterApi'
