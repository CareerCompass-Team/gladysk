import { Link } from 'react-router-dom'
import { ChevronRight, Clock, MapPin, ExternalLink, CalendarClock, GraduationCap } from 'lucide-react'
import CompanyAvatar from '../ui/CompanyAvatar'
import StatusBadge from './StatusBadge'

const CANDIDATE_COLUMNS = '1.6fr 1.2fr 130px 110px 1fr 80px'
const COLUMNS = '1.2fr 1.2fr 130px 120px 1.5fr 80px'

// Initials avatar for candidates
function CandidateAvatar({ name = '' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
    >
      {initials || 'C'}
    </div>
  )
}

export default function ApplicationList({ applications, onCardClick }) {
  const isRecruiter = !!onCardClick

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-1)' }}>
      {/* Table Header */}
      <div
        className="grid px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider border-b"
        style={{
          gridTemplateColumns: isRecruiter ? CANDIDATE_COLUMNS : COLUMNS,
          color: 'var(--text-4)',
          borderColor: 'var(--border-2)',
          background: 'var(--surface-hover)',
        }}
      >
        {isRecruiter ? (
          <>
            <span>Candidate</span>
            <span>Applied Role</span>
            <span>Stage</span>
            <span>ATS Match</span>
            <span>University / Course</span>
            <span className="text-right">Review</span>
          </>
        ) : (
          <>
            <span>Company / Org</span>
            <span>Role Title</span>
            <span>Current Status</span>
            <span>Applied / Saved</span>
            <span>Next Step / Milestone</span>
            <span className="text-right">Action</span>
          </>
        )}
      </div>

      {/* Table Rows */}
      {applications.map((app, idx) => {
        const isSaved = app.status === 'Saved'
        const atsScore = app.matchScore
        const atsColor = atsScore >= 90 ? '#10b981' : atsScore >= 75 ? '#f59e0b' : '#ef4444'

        const content = isRecruiter ? (
          <>
            {/* Candidate name + avatar */}
            <div className="flex items-center gap-2.5 min-w-0">
              <CandidateAvatar name={app.candidateName || app.role} />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate" style={{ color: 'var(--text-1)' }}>
                  {app.candidateName || 'Candidate'}
                </div>
                <div className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-5)' }}>
                  <MapPin size={10} />{app.location || 'Nairobi, Kenya'}
                </div>
              </div>
            </div>

            {/* Applied role */}
            <div className="text-xs font-medium truncate" style={{ color: 'var(--accent-text)' }}>
              {app.role}
            </div>

            {/* Stage badge */}
            <div>
              <StatusBadge status={app.status} showDot />
            </div>

            {/* ATS score */}
            <div>
              {atsScore ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${atsColor}20`, color: atsColor }}>
                  {atsScore}%
                </span>
              ) : (
                <span className="text-xs" style={{ color: 'var(--text-5)' }}>—</span>
              )}
            </div>

            {/* University */}
            <div className="text-xs truncate flex items-center gap-1" style={{ color: 'var(--text-3)' }}>
              <GraduationCap size={12} className="shrink-0" style={{ color: 'var(--text-5)' }} />
              <span className="truncate">{app.candidateUniversity || '—'}</span>
            </div>

            {/* Action */}
            <div className="text-right">
              <span className="text-xs font-medium inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--accent)' }}>
                Review <ChevronRight size={13} />
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 min-w-0">
              <CompanyAvatar name={app.company} size="sm" />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate" style={{ color: 'var(--text-1)' }}>{app.company}</div>
                <div className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-5)' }}>
                  <MapPin size={10} />{app.location || 'Remote'}
                </div>
              </div>
            </div>

            <div className="text-xs font-medium truncate" style={{ color: 'var(--accent-text)' }}>
              {app.role}
            </div>

            <div>
              <StatusBadge status={app.status} showDot />
            </div>

            <div className="text-xs font-mono" style={{ color: 'var(--text-4)' }}>
              {app.appliedDate ? app.appliedDate : isSaved ? 'Saved Wishlist' : 'Active'}
            </div>

            <div className="text-xs truncate flex items-center gap-1" style={{ color: 'var(--text-3)' }}>
              {app.nextStep ? (
                <>
                  <Clock size={12} className="text-amber-400 shrink-0" />
                  <span className="truncate">{app.nextStep}</span>
                </>
              ) : (
                <span style={{ color: 'var(--text-5)' }}>No pending action</span>
              )}
            </div>

            <div className="text-right">
              <span
                className="text-xs font-medium inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                style={{ color: 'var(--accent)' }}
              >
                View <ChevronRight size={13} />
              </span>
            </div>
          </>
        )

        if (onCardClick) {
          return (
            <div
              key={app.id}
              onClick={() => onCardClick(app)}
              className="grid px-5 py-3.5 transition-colors items-center cursor-pointer group"
              style={{
                gridTemplateColumns: isRecruiter ? CANDIDATE_COLUMNS : COLUMNS,
                borderBottom: idx < applications.length - 1 ? '1px solid var(--border-3)' : 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {content}
            </div>
          )
        }

        return (
          <Link
            key={app.id}
            to={isSaved ? `/jobs/${app.jobId}` : app.status === 'Offer' ? `/applications/${app.id}/offer` : `/applications/${app.id}`}
            className="grid px-5 py-3.5 transition-colors items-center group"
            style={{
              gridTemplateColumns: COLUMNS,
              borderBottom: idx < applications.length - 1 ? '1px solid var(--border-3)' : 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {content}
          </Link>
        )
      })}
    </div>
  )
}
