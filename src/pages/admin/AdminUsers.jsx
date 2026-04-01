import { useEffect, useState } from 'react'
import {
  approveUser,
  getPendingUsers,
  getUsers,
  rejectUser,
  requestInfo,
} from '../../mvc/controllers/adminController'

const getProfileDetails = (user) => {
  if (!user) return []

  if (user.role === 'farmer') {
    return [
      ['Phone Number', user.phoneNumber || '-'],
      ['Farm Address', user.farmAddress || '-'],
    ]
  }

  if (user.role === 'transporter') {
    return [
      ['Phone Number', user.phoneNumber || '-'],
      ['Vehicle', user.vehicle || '-'],
    ]
  }

  if (user.role === 'buyer') {
    return [
      ['Phone Number', user.phoneNumber || '-'],
      ['Address', user.address || '-'],
    ]
  }

  return [['Profile', 'No role profile details']]
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [roleFilter, setRoleFilter] = useState('')
  const [approvalFilter, setApprovalFilter] = useState('pending')
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
    load()
  }, [roleFilter, approvalFilter])

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
    setSelectedUser(null)
    setInfoMessage('')
  }

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Approval Queue</h2>
        <p className="mt-1 text-sm text-slate-600">
          Pending accounts waiting for ministry review: <strong>{pendingCount}</strong>
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Roles</option>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
            <option value="transporter">Transporter</option>
            <option value="ministry">Ministry</option>
          </select>

          <select
            value={approvalFilter}
            onChange={(event) => setApprovalFilter(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Approval States</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setRoleFilter('')
              setApprovalFilter('pending')
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
          >
            Reset Filters
          </button>

          <button
            type="button"
            onClick={load}
            className="rounded-md border border-emerald-300 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
          >
            Refresh
          </button>
        </div>

        {feedback && <p className="mt-2 text-sm text-emerald-700">{feedback}</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
        {loading ? (
          <p className="text-sm text-slate-600">Loading users...</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Approval</th>
                <th className="px-3 py-2">Profile</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100">
                  <td className="px-3 py-2">{user.name}</td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2 capitalize">{user.role}</td>
                  <td className="px-3 py-2 capitalize">{user.approvalStatus}</td>
                  <td className="px-3 py-2">
                    {user.role === 'farmer' && user.farmAddress && (
                      <span className="text-xs text-slate-600">{user.farmAddress}</span>
                    )}
                    {user.role === 'transporter' && user.vehicle && (
                      <span className="text-xs text-slate-600">{user.vehicle}</span>
                    )}
                    {user.role === 'buyer' && user.address && (
                      <span className="text-xs text-slate-600">{user.address}</span>
                    )}
                    {!(
                      (user.role === 'farmer' && user.farmAddress) ||
                      (user.role === 'transporter' && user.vehicle) ||
                      (user.role === 'buyer' && user.address)
                    ) && <span className="text-xs text-slate-500">-</span>}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(user)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                      >
                        View
                      </button>
                      {user.approvalStatus === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleApprove(user.id)}
                          className="rounded-md border border-emerald-300 px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
                        >
                          Approve
                        </button>
                      )}
                      {user.approvalStatus !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleReject(user.id)}
                          className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td className="px-3 py-3 text-sm text-slate-500" colSpan={6}>
                    No users found for current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-800">User Details</h3>
            <p className="mt-1 text-sm text-slate-600">
              {selectedUser.name} ({selectedUser.role})
            </p>

            <div className="mt-4 space-y-2 text-sm">
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

            <textarea
              rows={4}
              value={infoMessage}
              onChange={(event) => setInfoMessage(event.target.value)}
              placeholder="Request more information from this user..."
              className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null)
                  setInfoMessage('')
                }}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
              >
                Close
              </button>
              {selectedUser.approvalStatus === 'pending' && (
                <button
                  type="button"
                  onClick={async () => {
                    await handleApprove(selectedUser.id)
                    setSelectedUser(null)
                    setInfoMessage('')
                  }}
                  className="rounded-md border border-emerald-300 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                >
                  Approve
                </button>
              )}
              <button
                type="button"
                onClick={async () => {
                  await handleReject(selectedUser.id)
                  setSelectedUser(null)
                  setInfoMessage('')
                }}
                className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={handleRequestInfo}
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
