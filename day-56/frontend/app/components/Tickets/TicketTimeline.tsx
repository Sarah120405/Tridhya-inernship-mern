"use client";

import { TicketActivity } from "../../store/slice/activitySlice";
import { formatActivityDate, formatDate, formatRole } from "../../utils/date";
import {
  formatActivityAction,
  getActivityDescription,
} from "../../utils/ticketStyles";

interface TicketTimelineProps {
  activities: TicketActivity[];
  isLoading: boolean;
  error: string | null;
}

export default function TicketTimeline({
  activities,
  isLoading,
  error,
}: TicketTimelineProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-2">
      {/* <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Activity Timeline
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Track all important actions and updates on this ticket.
          </p>
        </div>
      </div> */}

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-4 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />

              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-64 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">
            No activity has been recorded for this ticket yet.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-gray-200" />

          <div className="space-y-7">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative flex gap-4">
                {/* Timeline icon */}
                <div className="relative z-10 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>

                {/* Activity content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {formatActivityAction(activity.action)}
                      </h3>

                      <p className="text-sm text-gray-600 mt-1">
                        {getActivityDescription(activity)}
                      </p>
                    </div>

                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatActivityDate(activity.createdAt)}
                    </span>
                  </div>

                  {activity.user && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                        {activity.user.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-700">
                          {activity.user.name}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {formatRole(activity.user.role)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
