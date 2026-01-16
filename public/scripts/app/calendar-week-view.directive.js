(function () {
    'use strict';
    angular
        .module('app')
        .directive('calendarWeekView', CalendarWeekViewDirective);

    CalendarWeekViewDirective.$inject = [];

    function CalendarWeekViewDirective() {
        return {
            restrict: 'E',
            scope: {
                calendarCtrl: '=' // This binds to vm from the parent scope
            },
            template: `
                <!-- Week View -->
                <div ng-if="calendarCtrl.calendarType === 'week'" class="calendar-week-view">
                    <!-- Week Navigation -->
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <button class="btn btn-outline-primary" ng-click="calendarCtrl.navigateWeek('prev')">
                            <i class="bi bi-chevron-left"></i> Previous Week
                        </button>
                        <h5 class="mb-0">{{ calendarCtrl.formatDate(calendarCtrl.selectedDate) }}</h5>
                        <button class="btn btn-outline-primary" ng-click="calendarCtrl.navigateWeek('next')">
                            Next Week <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>

                    <!-- Week Grid with Time Slots -->
                    <div class="calendar-week-grid-time">
                        <!-- Day Headers -->
                        <div class="calendar-week-time-header">
                            <div class="calendar-time-column-header"></div>
                            <div class="calendar-day-header-cell text-center py-2" 
                                 ng-repeat="day in calendarCtrl.calendarDays"
                                 ng-class="{'calendar-day-today': calendarCtrl.isToday(day.date)}">
                                <div class="fw-semibold">{{ day.dayName }}</div>
                                <div class="small text-muted">{{ day.day }}</div>
                            </div>
                        </div>

                        <!-- Time Slots Grid -->
                        <div class="calendar-week-time-grid">
                            <div class="calendar-time-row" ng-repeat="timeSlot in calendarCtrl.timeSlots">
                                <!-- Time Label (Left Side) -->
                                <div class="calendar-time-label">
                                    <span>{{ timeSlot.hour12 }}</span>
                                </div>
                                
                                <!-- Day Cells for this Time Slot -->
                                <div class="calendar-time-cell position-relative" 
                                     ng-repeat="day in calendarCtrl.calendarDays"
                                     ng-class="{
                                         'calendar-day-today': calendarCtrl.isToday(day.date),
                                         'calendar-time-past': calendarCtrl.isTimePast(day.date, timeSlot.hour)
                                     }">
                                    
                                    <!-- Posts for this time slot -->
                                    <div class="calendar-time-posts" ng-if="calendarCtrl.getPostsForTimeSlot(day.date, timeSlot.hour).length > 0">
                                        <div class="calendar-post-item-time mb-1 p-2 rounded border" 
                                             ng-repeat="post in calendarCtrl.getPostsForTimeSlot(day.date, timeSlot.hour)"
                                             ng-class="{
                                                 'border-info': post.status === 1,
                                                 'border-success': post.status === 2,
                                                 'border-danger': post.status === 3
                                             }"
                                             style="cursor: pointer;"
                                             ng-click="calendarCtrl.openPostPreview(post)">
                                            
                                            <!-- Post Content -->
                                            <div class="small text-truncate mb-1 fw-semibold" ng-if="calendarCtrl.getPostContent(post)">
                                                {{ calendarCtrl.getPostContent(post) }}
                                            </div>
                                            
                                            <!-- Post Accounts -->
                                            <div class="d-flex align-items-center gap-1 mb-1" ng-if="post.accounts && post.accounts.length > 0">
                                                <i class="bi" 
                                                   ng-class="{
                                                       'bi-twitter text-primary': account.provider === 'twitter',
                                                       'bi-facebook text-primary': account.provider === 'facebook',
                                                       'bi-instagram text-danger': account.provider === 'instagram',
                                                       'bi-linkedin text-primary': account.provider === 'linkedin'
                                                   }"
                                                   ng-repeat="account in (post.accounts | limitTo: 3)"
                                                   title="{{ account.name }}"></i>
                                                <span class="small text-muted" ng-if="post.accounts.length > 3">+{{ post.accounts.length - 3 }}</span>
                                            </div>
                                            
                                            <!-- Post Time & Status -->
                                            <div class="d-flex justify-content-between align-items-center">
                                                <small class="text-muted" ng-if="post.scheduled_at && post.scheduled_at.time">
                                                    <i class="bi bi-clock"></i> {{ post.scheduled_at.time }}
                                                </small>
                                                <span class="badge badge-sm" ng-class="calendarCtrl.getPostStatusClass(post.status)">
                                                    {{ calendarCtrl.getPostStatusText(post.status) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Add Post Button -->
                                    <div class="calendar-time-add position-absolute top-0 end-0 m-1" 
                                         ng-if="!calendarCtrl.isTimePast(day.date, timeSlot.hour)">
                                        <button class="btn btn-sm btn-link p-1" 
                                                ng-click="calendarCtrl.createPostForTimeSlot(day.date, timeSlot.hour24)"
                                                title="Add post">
                                            <i class="bi bi-plus-circle"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }
})();

