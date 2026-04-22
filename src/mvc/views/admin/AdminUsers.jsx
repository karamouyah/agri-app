import { useEffect, useState } from 'react'
import {
  approveUser,
  getPendingUsers,
  getUsers,
  rejectUser,
  requestInfo,
} from '../../controllers/adminController'
import { useLocations } from '../../../context/LocationContext'
import { Card, EmptyState, PageHeader, Select, StatusBadge, Textarea, buttonStyles, cn } from '../../../components/ui'

const getProfileDetails = (user) => {
  if (!user) return []

  if (user.role === 'farmer') {
    return [
      ['Phone Number', user.phoneNumber || '-'],
      ['Farm Address', user.farmAddress || '-'],
      ['Structured Location', user.locationLabel || '-'],
    ]
  }

  if (user.role === 'transporter') {
    return [
      ['Phone Number', user.phoneNumber || '-'],
      ['Vehicle', user.vehicle || '-'],
      ['Max Load', user.maxLoadKg ? `${user.maxLoadKg} KG` : '-'],
      ['Delivery Wilayas', user.deliveryWilayas.map((item) => item.name).join(', ') || '-'],
    ]
  }

  if (user.role === 'buyer') {
    return [
      ['Phone Number', user.phoneNumber || '-'],
      ['Address', user.address || '-'],
      ['Structured Location', user.locationLabel || '-'],
    ]
  }

  return [['Profile', 'No role profile details']]
}

export default function AdminUsers() {
  const { wilayas } = useLocations()
  const [users, setUsers] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [roleFilter, setRoleFilter] = useState('')
  const [approvalFilter, setApprovalFilter] = useState('pending')
  const [wilayaFilter, setWilayaFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [infoMessage, setInfoMessage] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [list, pending] = await Promise.all([
        getUsers({
          role: roleFilter || undefined,
          approvalStatus: approvalFilter || undefined,
          wilaya: wilayaFilter || undefined,
        }),
        getPendingUsers(),
      ])
      setUsers(list)
      setPendingCount(pending.length)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const syncUsers = async () => {
      setLoading(true)
      setError('')
      try {
        const [list, pending] = await Promise.all([
          getUsers({
            role: roleFilter || undefined,
            approvalStatus: approvalFilter || undefined,
            wilaya: wilayaFilter || undefined,
          }),
          getPendingUsers(),
        ])
        setUsers(list)
        setPendingCount(pending.length)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    syncUsers()
  }, [roleFilter, approvalFilter, wilayaFilter])

  const closeModal = () => {
    setSelectedUser(null)
    setInfoMessage('')
  }

  const handleApprove = async (id) => {
    await approveUser(id)
    setFeedback('Account approved successfully.')
    await load()
  }

  const handleReject = async (id) => {
    await rejectUser(id)
    setFeedback('Account rejected.')
    await load()
  }

  const handleRequestInfo = async () => {
    if (!selectedUser || !infoMessage.trim()) return

    await requestInfo(selectedUser.id, infoMessage)
    setFeedback(`Information request sent to ${selectedUser.name}.`)
    closeModal()
  }

  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Approval Queue"
        title="Review and approve user onboarding"
        description="Filter accounts by role, approval status, and wilaya before reviewing the submitted details."
        meta={[
          { label: 'Pending', value: pendingCount },
          { label: 'Visible users', value: users.length },
          { label: 'Workflow', value: 'Approval controlled' },
        ]}
      />

      <Card className="p-5 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="">All Roles</option>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
            <option value="transporter">Transporter</option>
            <option value="ministry">Ministry</option>
          </Select>

          <Select value={approvalFilter} onChange={(event) => setApprovalFilter(event.target.value)}>
            <option value="">All Approval States</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>

          <Select value={wilayaFilter} onChange={(event) => setWilayaFilter(event.target.value)}>
            <option value="">All Wilayas</option>
            {wilayas.map((wilaya) => (
              <option key={wilaya.id} value={wilaya.id}>
                {wilaya.code} - {wilaya.name}
              </option>
            ))}
          </Select>

          <button
            type="button"
            onClick={() => {
              setRoleFilter('')
              setApprovalFilter('pending')
              setWilayaFilter('')
            }}
            className={buttonStyles.secondary}
          >
            Reset Filters
          </button>

          <button type="button" onClick={load} className={buttonStyles.primary}>
            Refresh
          </button>
        </div>

        {feedback ? (
          <p className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
            {feedback}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        ) : null}
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="px-5 py-8 text-sm text-slate-600 dark:text-slate-300 md:px-6">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="px-5 py-6 md:px-6">
            <EmptyState
              title="No users found"
              description="No users match the current role, approval, or wilaya filters. Adjust the filters or refresh the queue."
            />
          </div>
        ) : (
          <div className="table-shell m-5 md:m-6">
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Approval</th>
                    <th>Profile</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</td>
                      <td>{user.email}</td>
                      <td className="capitalize">{user.role}</td>
                      <td>
                        <StatusBadge status={user.approvalStatus} />
                      </td>
                      <td>
                        {user.role === 'farmer' && user.farmAddress ? (
                          <span className="text-xs text-slate-600 dark:text-slate-300">
                            {user.locationLabel || user.farmAddress}
                          </span>
                        ) : null}
                        {user.role === 'transporter' && user.vehicle ? (
                          <span className="text-xs text-slate-600 dark:text-slate-300">
                            {user.vehicle}
                            {user.maxLoadKg ? ` • ${user.maxLoadKg} KG` : ''}
                          </span>
                        ) : null}
                        {user.role === 'buyer' && user.address ? (
                          <span className="text-xs text-slate-600 dark:text-slate-300">{user.locationLabel || user.address}</span>
                        ) : null}
                        {!(
                          (user.role === 'farmer' && user.farmAddress) ||
                          (user.role === 'transporter' && user.vehicle) ||
                          (user.role === 'buyer' && user.address)
                        ) ? <span className="text-xs text-slate-500 dark:text-slate-400">-</span> : null}
                      </td>
                      <td>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className={cn(buttonStyles.secondary, 'px-3 py-2 text-xs')}
                          >
                            View
                          </button>
                          {user.approvalStatus === 'pending' ? (
                            <button
                              type="button"
                              onClick={() => handleApprove(user.id)}
                              className={cn(buttonStyles.primary, 'px-3 py-2 text-xs')}
                            >
                              Approve
                            </button>
                          ) : null}
                          {user.approvalStatus !== 'rejected' ? (
                            <button
                              type="button"
                              onClick={() => handleReject(user.id)}
                              className={cn(
                                buttonStyles.secondary,
                                'border-rose-200 px-3 py-2 text-xs text-rose-700 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/30',
                              )}
                            >
                              Reject
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {selectedUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-5 md:p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">User Details</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {selectedUser.name} ({selectedUser.role})
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <p>
                <span className="font-medium">Email:</span> {selectedUser.email}
              </p>
              <p>
                <span className="font-medium">Approval Status:</span>{' '}
                <span className="capitalize">{selectedUser.approvalStatus}</span>
              </p>
              {getProfileDetails(selectedUser).map(([label, value]) => (
                <p key={label}>
                  <span className="font-medium">{label}:</span> {value}
                </p>
              ))}
            </div>

            <Textarea
              rows={4}
              value={infoMessage}
              onChange={(event) => setInfoMessage(event.target.value)}
              placeholder="Request more information from this user..."
              className="mt-4"
            />

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={closeModal} className={buttonStyles.secondary}>
                Close
              </button>
              {selectedUser.approvalStatus === 'pending' ? (
                <button
                  type="button"
                  onClick={async () => {
                    await handleApprove(selectedUser.id)
                    closeModal()
                  }}
                  className={buttonStyles.primary}
                >
                  Approve
                </button>
              ) : null}
              <button
                type="button"
                onClick={async () => {
                  await handleReject(selectedUser.id)
                  closeModal()
                }}
                className={cn(
                  buttonStyles.secondary,
                  'border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/30',
                )}
              >
                Reject
              </button>
              <button type="button" onClick={handleRequestInfo} className={buttonStyles.primary}>
                Send Request
              </button>
            </div>
          </Card>
        </div>
      ) : null}
    </section>
  )
}

