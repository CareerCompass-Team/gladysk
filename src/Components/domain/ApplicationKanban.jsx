import { Link } from 'react-router-dom'
import {
  Bookmark, Send, Search, CalendarClock, Sparkles,
  Trophy, CheckCircle2, XCircle, ArrowRight, Video, ChevronRight, Clock,
  GraduationCap, Star,
} from 'lucide-react'
import CompanyAvatar from '../ui/CompanyAvatar'
import EmptyState from '../ui/EmptyState'
import { APPLICATION_STATUSES, applicationStatusColor } from '../../lib/status'

const STATUS_ICONS = {
  Saved: Bookmark,
  Applied: Send,
  Screening: Search,
  Interview: CalendarClock,
  'Final Stage': Sparkles,
  Offer: Trophy,
  Accepted: CheckCircle2,
  'Not Selected': XCircle,
}

// Initials avatar for candidates
function CandidateAvatar({ name = '' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
    >
      {initials || 'C'}
    </div>
  )
}

export default function ApplicationKanban({ applications, onCardClick, onAdvanceStatus }) {
  const isRecruiter = !!onCardClick

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none">
      {APPLICATION_STATUSES.map((status, colIdx) => {
        const column = applications.filter(a => a.status === status)
        const StatusIcon = STATUS_ICONS[status] || Bookmark
        const colColor = applicationStatusColor[status] || 'var(--accent)'

        return (
          <div
            key={status}
            className="shrink-0 w-64 stagger-item flex flex-col rounded-2xl p-3.5 transition-colors"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-1)',
              animationDelay: `${colIdx * 0.04}s`,
            }}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                  style={{ background: `${colColor}1f`, color: colColor }}
                >
                  <StatusIcon size={14} strokeWidth={2.2} />
                </div>
                <span className="font-display text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-1)' }}>
                  {status}
                </span>
              </div>
              <span
                className="font-mono text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: `${colColor}20`, color: colColor }}
              >
                {column.length}
              </span>
            </div>

            {/* Accent divider line */}
            <div className="h-0.5 w-full rounded-full mb-3" style={{ background: `${colColor}40` }} />

            {/* Column Cards */}
            <div className="flex flex-col gap-3 min-h-[160px]">
              {column.map((app) => {
                const isSaved = app.status === 'Saved'
                const isOffer = app.status === 'Offer'
                const isInterview = app.status === 'Interview'
                const atsScore = app.matchScore
                const atsColor = atsScore >= 90 ? '#10b981' : atsScore >= 75 ? '#f59e0b' : '#ef4444'

                // ── Recruiter candidate card ──────────────────────────
                const recruiterCardBody = (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CandidateAvatar name={app.candidateName || app.role} />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate" style={{ color: 'var(--text-1)' }}>
                            {app.candidateName || 'Candidate'}
                          </div>
                          <div className="text-[11px] truncate" style={{ color: 'var(--accent-text)' }}>
                            {app.role}
                          </div>
                        </div>
                      </div>
                      {atsScore && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: `${atsColor}20`, color: atsColor }}>
                          {atsScore}%
                        </span>
                      )}
                    </div>

                    {app.candidateUniversity && (
                      <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-5)' }}>
                        <GraduationCap size={10} />
                        <span className="truncate">{app.candidateUniversity}</span>
                      </div>
                    )}

                    {isInterview && app.interviewDate && (
                      <div className="text-[10px] px-2 py-1 rounded-lg flex items-center gap-1.5 font-medium" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                        <CalendarClock size={10} />
                        {app.interviewDate} · {app.interviewTime}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] pt-1.5 mt-1 border-t" style={{ borderColor: 'var(--border-3)' }}>
                      <span className="font-mono" style={{ color: 'var(--text-5)' }}>Applied {app.appliedDate}</span>
                      <span className="font-semibold" style={{ color: colColor }}>Review →</span>
                    </div>
                  </div>
                )

                // ── Standard candidate job-seeker card ────────────────
                const candidateCardBody = (
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CompanyAvatar name={app.company} size="sm" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate" style={{ color: 'var(--text-1)' }}>
                            {app.company}
                          </div>
                          <div className="text-[11px] truncate" style={{ color: 'var(--accent-text)' }}>
                            {app.role}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-hover)', color: 'var(--text-5)' }}>
                        {app.location || 'Remote'}
                      </span>
                    </div>

                    {app.nextStep && (
                      <div
                        className="text-[11px] px-2.5 py-1.5 rounded-lg flex items-start gap-1.5 font-medium border"
                        style={{
                          background: isOffer
                            ? 'rgba(16,185,129,0.1)'
                            : isInterview
                            ? 'rgba(245,158,11,0.1)'
                            : 'var(--surface-hover)',
                          borderColor: isOffer
                            ? 'rgba(16,185,129,0.25)'
                            : isInterview
                            ? 'rgba(245,158,11,0.25)'
                            : 'var(--border-3)',
                          color: isOffer ? '#10b981' : isInterview ? '#f59e0b' : 'var(--text-3)',
                        }}
                      >
                        <Clock size={12} className="mt-0.5 shrink-0" />
                        <span className="truncate">{app.nextStep}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] pt-2 mt-1 border-t" style={{ borderColor: 'var(--border-3)' }}>
                      <span className="font-mono text-[10px]" style={{ color: 'var(--text-5)' }}>
                        {app.appliedDate ? `Applied ${app.appliedDate}` : isSaved ? 'Saved in Wishlist' : 'Active'}
                      </span>

                      {onAdvanceStatus && status !== 'Accepted' && status !== 'Not Selected' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onAdvanceStatus(app)
                          }}
                          className="text-[10px] px-2 py-0.5 rounded font-semibold press-scale flex items-center gap-0.5"
                          style={{ background: `${colColor}25`, color: colColor }}
                        >
                          {isSaved ? 'Apply Now' : 'Advance'} <ChevronRight size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                )

                const cardBody = isRecruiter ? recruiterCardBody : candidateCardBody

                if (onCardClick) {
                  return (
                    <div
                      key={app.id}
                      onClick={() => onCardClick(app)}
                      className="rounded-xl p-3.5 block transition-all duration-150 hover-lift cursor-pointer border"
                      style={{ background: 'var(--bg-page)', borderColor: 'var(--border-1)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = colColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-1)')}
                    >
                      {cardBody}
                    </div>
                  )
                }

                return (
                  <Link
                    key={app.id}
                    to={isSaved ? `/jobs/${app.jobId}` : isOffer ? `/applications/${app.id}/offer` : `/applications/${app.id}`}
                    className="rounded-xl p-3.5 block transition-all duration-150 hover-lift border group"
                    style={{ background: 'var(--bg-page)', borderColor: 'var(--border-1)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = colColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-1)')}
                  >
                    {cardBody}
                  </Link>
                )
              })}

              {column.length === 0 && (
                <div className="py-8 text-center rounded-xl border border-dashed" style={{ borderColor: 'var(--border-3)' }}>
                  <EmptyState message={`No ${status.toLowerCase()} ${isRecruiter ? 'candidates' : 'jobs'}`} />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
