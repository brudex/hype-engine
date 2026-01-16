(function () {
    'use strict';
    angular
        .module('app')
        .directive('calendarMonthView', CalendarMonthViewDirective);

    CalendarMonthViewDirective.$inject = [];

    function CalendarMonthViewDirective() {
        return {
            restrict: 'E',
            scope: {
                calendarCtrl: '=' // This binds to vm from the parent scope
            },
            template: `
                <!-- Month View -->
                <div ng-if="calendarCtrl.calendarType === 'month'" class="calendar-month-view">
                    <!-- Month Navigation -->
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <button class="btn btn-outline-primary" ng-click="calendarCtrl.navigateMonth('prev')">
                            <i class="bi bi-chevron-left"></i> Previous
                        </button>
                        <h5 class="mb-0">{{ calendarCtrl.getMonthName() }}</h5>
                        <button class="btn btn-outline-primary" ng-click="calendarCtrl.navigateMonth('next')">
                            Next <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>

                    <!-- Weekday Headers -->
                    <div class="calendar-weekdays row g-0 border-top border-start">
                        <div class="col calendar-weekday-header text-center py-2 border-end border-bottom fw-semibold" ng-repeat="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']">
                            {{ day }}
                        </div>
                    </div>

                    <!-- Calendar Grid -->
                    <div class="calendar-grid">
                        <div class="row g-0 border-start" ng-repeat="week in [0,1,2,3,4,5]">
                            <div class="col calendar-day-cell border-end border-bottom position-relative" 
                                 ng-repeat="day in calendarCtrl.calendarDays.slice(week * 7, (week + 1) * 7)"
                                 ng-class="{
                                     'calendar-day-other-month': !day.isCurrentMonth,
                                     'calendar-day-disabled': day.isDisabled,
                                     'calendar-day-today': calendarCtrl.isToday(day.date),
                                     'has-posts': day.posts && day.posts.length > 0
                                 }">
                                
                                <!-- Day Number -->
                                <div class="calendar-day-number position-absolute top-0 start-0 m-2">
                                    <span class="badge" 
                                          ng-class="{
                                              'bg-primary': calendarCtrl.isToday(day.date),
                                              'text-muted': day.isDisabled || !day.isCurrentMonth
                                          }">
                                        {{ day.day }}
                                    </span>
                                </div>

                                <!-- Add Post Button -->
                                <div class="calendar-day-add position-absolute top-0 end-0 m-2" 
                                     ng-if="!day.isDisabled">
                                    <button class="btn btn-sm btn-link p-1" 
                                            ng-click="calendarCtrl.createPostForDate(day.date)"
                                            title="Add post">
                                        <i class="bi bi-plus-circle"></i>
                                    </button>
                                </div>

                                <!-- Posts List -->
                                <div class="calendar-day-posts" ng-if="day.posts && day.posts.length > 0">
                                    <div class="calendar-post-item mb-1 p-1 rounded border" 
                                         ng-repeat="post in day.posts"
                                         ng-class="{
                                             'border-info': post.status === 1,
                                             'border-success': post.status === 2,
                                             'border-danger': post.status === 3
                                         }"
                                         style="cursor: pointer;"
                                         ng-click="calendarCtrl.openPostPreview(post)">
                                        
                                        <!-- Post Content -->
                                        <div class="small text-truncate mb-1" ng-if="calendarCtrl.getPostContent(post)">
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
                                               ng-repeat="account in post.accounts | limitTo: 3"
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
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }
})();

