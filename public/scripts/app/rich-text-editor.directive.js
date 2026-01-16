(function () {
    'use strict';
    angular
        .module('app')
        .directive('richTextEditor', RichTextEditorDirective);

    RichTextEditorDirective.$inject = ['$timeout', '$sce'];

    function RichTextEditorDirective($timeout, $sce) {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                placeholder: '@',
                onUpdate: '&?'
            },
            template: `
                <div class="rich-text-editor-wrapper">
                    <div ng-attr-id="{{ editorId }}"></div>
                    <!-- Emoji Picker -->
                    <div ng-if="showEmojiPicker" 
                         class="emoji-picker" 
                         ng-style="emojiPickerStyle"
                         ng-click="$event.stopPropagation()">
                        <div class="emoji-picker-header">
                            <h4 class="emoji-picker-title">Select Emoji</h4>
                            <button type="button" 
                                    class="emoji-picker-close"
                                    ng-click="closeEmojiPicker()"
                                    title="Close">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                        <div class="emoji-picker-categories">
                            <button type="button" 
                                    class="emoji-category-btn"
                                    ng-class="{'active': activeCategory === 'smileys'}"
                                    ng-click="setCategory('smileys')"
                                    title="Smileys">
                                😀
                            </button>
                            <button type="button" 
                                    class="emoji-category-btn"
                                    ng-class="{'active': activeCategory === 'gestures'}"
                                    ng-click="setCategory('gestures')"
                                    title="Gestures">
                                👋
                            </button>
                            <button type="button" 
                                    class="emoji-category-btn"
                                    ng-class="{'active': activeCategory === 'people'}"
                                    ng-click="setCategory('people')"
                                    title="People">
                                👤
                            </button>
                            <button type="button" 
                                    class="emoji-category-btn"
                                    ng-class="{'active': activeCategory === 'animals'}"
                                    ng-click="setCategory('animals')"
                                    title="Animals">
                                🐶
                            </button>
                            <button type="button" 
                                    class="emoji-category-btn"
                                    ng-class="{'active': activeCategory === 'food'}"
                                    ng-click="setCategory('food')"
                                    title="Food">
                                🍕
                            </button>
                            <button type="button" 
                                    class="emoji-category-btn"
                                    ng-class="{'active': activeCategory === 'travel'}"
                                    ng-click="setCategory('travel')"
                                    title="Travel">
                                ✈️
                            </button>
                            <button type="button" 
                                    class="emoji-category-btn"
                                    ng-class="{'active': activeCategory === 'activities'}"
                                    ng-click="setCategory('activities')"
                                    title="Activities">
                                ⚽
                            </button>
                            <button type="button" 
                                    class="emoji-category-btn"
                                    ng-class="{'active': activeCategory === 'objects'}"
                                    ng-click="setCategory('objects')"
                                    title="Objects">
                                💡
                            </button>
                            <button type="button" 
                                    class="emoji-category-btn"
                                    ng-class="{'active': activeCategory === 'symbols'}"
                                    ng-click="setCategory('symbols')"
                                    title="Symbols">
                                ❤️
                            </button>
                        </div>
                        <div class="emoji-picker-content">
                            <div class="emoji-grid">
                                <button type="button"
                                        ng-repeat="emoji in getCurrentCategoryEmojis()" 
                                        class="emoji-item"
                                        ng-click="selectEmoji(emoji)"
                                        title="{{ emoji }}">
                                    {{ emoji }}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div ng-if="showEmojiPicker" 
                         class="emoji-picker-backdrop" 
                         ng-click="closeEmojiPicker()"
                         ng-mousedown="$event.preventDefault()"></div>
                    <!-- Link Popup -->
                    <div ng-if="showLinkPopup" 
                         class="link-popup" 
                         ng-style="linkPopupStyle"
                         ng-click="$event.stopPropagation()">
                        <div class="link-popup-header">
                            <h4 class="link-popup-title">Insert Link</h4>
                            <button type="button" 
                                    class="link-popup-close"
                                    ng-click="closeLinkPopup()"
                                    title="Close">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                        <div class="link-popup-content">
                            <div class="link-popup-field">
                                <label class="link-popup-label">URL</label>
                                <input type="text" 
                                       class="link-popup-input"
                                       ng-model="linkUrl"
                                       placeholder="https://example.com"
                                       autocomplete="off"
                                       data-lpignore="true"
                                       data-1p-ignore="true"
                                       data-form-type="other"
                                       data-browser-extension-ignore="true"
                                       data-dashlane-ignore="true"
                                       data-bitwarden-ignore="true"
                                       ng-keydown="handleLinkKeydown($event)">
                            </div>
                            <div class="link-popup-actions">
                                <button type="button" 
                                        class="link-popup-btn link-popup-btn-cancel"
                                        ng-click="closeLinkPopup()">
                                    Cancel
                                </button>
                                <button type="button" 
                                        class="link-popup-btn link-popup-btn-submit"
                                        ng-click="submitLink()">
                                    Insert Link
                                </button>
                            </div>
                        </div>
                    </div>
                    <div ng-if="showLinkPopup" 
                         class="link-popup-backdrop" 
                         ng-click="closeLinkPopup()"
                         ng-mousedown="$event.preventDefault()"></div>
                </div>
            `,
            link: function (scope, element, attrs, ngModel) {
                // Suppress browser extension errors
                var originalErrorHandler = window.onerror;
                window.onerror = function(msg, url, line, col, error) {
                    if (msg && msg.toString().indexOf('content_script.js') > -1) {
                        return true; // Suppress the error
                    }
                    if (originalErrorHandler) {
                        return originalErrorHandler.apply(this, arguments);
                    }
                    return false;
                };
                
                // Suppress unhandled promise rejections from extensions
                window.addEventListener('unhandledrejection', function(event) {
                    if (event.reason && event.reason.toString && event.reason.toString().indexOf('content_script.js') > -1) {
                        event.preventDefault();
                    }
                });
                
                // Generate unique ID for this editor instance
                scope.editorId = 'quill-editor-' + Math.random().toString(36).substr(2, 9);
                
                var quill = null;
                var isUpdating = false;
                
                // Store Quill instance on the element for external access
                scope.getQuillInstance = function() {
                    return quill;
                };
                
                // Expose Quill instance on the element
                element[0].quillInstance = function() {
                    return quill;
                };
                
                // Initialize scope variables
                scope.showEmojiPicker = false;
                scope.showLinkPopup = false;
                scope.activeCategory = 'smileys';
                scope.emojiPickerStyle = {};
                scope.linkPopupStyle = {};
                scope.emojiPickerReady = false;
                scope.linkPopupReady = false;
                scope.linkUrl = ''; // Initialize linkUrl
                
                // Emoji data organized by categories
                var emojiData = {
                    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😶‍🌫️', '😵', '😵‍💫', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
                    gestures: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'],
                    people: ['👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👨‍🦰', '👨‍🦱', '👨‍🦳', '👨‍🦲', '👩', '👩‍🦰', '🧑‍🦰', '👩‍🦱', '🧑‍🦱', '👩‍🦳', '🧑‍🦳', '👩‍🦲', '🧑‍🦲', '👱‍♀️', '👱‍♂️', '🧓', '👴', '👵', '🙍', '🙍‍♂️', '🙍‍♀️', '🙎', '🙎‍♂️', '🙎‍♀️', '🙅', '🙅‍♂️', '🙅‍♀️', '🙆', '🙆‍♂️', '🙆‍♀️', '💁', '💁‍♂️', '💁‍♀️', '🙋', '🙋‍♂️', '🙋‍♀️', '🧏', '🧏‍♂️', '🧏‍♀️', '🤦', '🤦‍♂️', '🤦‍♀️', '🤷', '🤷‍♂️', '🤷‍♀️', '👮', '👮‍♂️', '👮‍♀️', '🕵️', '🕵️‍♂️', '🕵️‍♀️'],
                    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦃', '🐓', '🦃', '🦤', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
                    food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕️', '🍵', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧃', '🧉', '🧊'],
                    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🛎️', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱️', '⏲️', '🕰️', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦'],
                    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🏹', '🎣', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩'],
                    objects: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🔬', '🔭', '📡'],
                    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❓', '❕', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜']
                };
                
                // Initialize Quill editor
                $timeout(function() {
                    // Check if Quill is available
                    if (typeof Quill === 'undefined') {
                        console.error('Quill.js is not loaded. Please include Quill.js script.');
                        return;
                    }
                    
                    var editorId = scope.editorId;
                    var editorEl = document.getElementById(editorId);
                    
                    if (!editorEl) {
                        console.error('Quill editor element not found:', editorId);
                        // Retry after a short delay
                        $timeout(function() {
                            editorEl = document.getElementById(editorId);
                            if (editorEl) {
                                initializeQuill();
                            }
                        }, 100);
                        return;
                    }
                    
                    initializeQuill();
                }, 200);
                
                // Initialize Quill function
                function initializeQuill() {
                    var editorId = scope.editorId;
                    var editorEl = document.getElementById(editorId);
                    
                    if (!editorEl) return;
                    
                    // Define toolbar configuration with custom link handler
                    var toolbarOptions = {
                        container: [
                            ['bold', 'italic', 'underline'],
                            ['link']
                        ],
                        handlers: {
                            'link': function(value) {
                                var self = this;
                                // Check if there's a link at the current selection
                                var range = self.quill.getSelection(true);
                                var format = range ? self.quill.getFormat(range) : {};
                                
                                // If there's already a link, remove it
                                if (format.link) {
                                    self.quill.format('link', false);
                                } else {
                                    // Show our custom link popup
                                    // Use $timeout to ensure Angular digest cycle
                                    $timeout(function() {
                                        if (scope && scope.toggleLinkPopup) {
                                            scope.toggleLinkPopup();
                                        }
                                    }, 0);
                                }
                            }
                        }
                    };
                    
                    // Initialize Quill with snow theme
                    quill = new Quill('#' + editorId, {
                        placeholder: scope.placeholder || 'What\'s on your mind?',
                        theme: 'snow',
                        modules: {
                            toolbar: toolbarOptions
                        }
                    });
                    
                    // Store Quill instance on the wrapper element for external access
                    var wrapperElement = element[0].querySelector('.rich-text-editor-wrapper');
                    if (wrapperElement) {
                        wrapperElement.quillInstance = quill;
                    }
                    
                    // Also store on the container element
                    var containerElement = element[0].querySelector('.ql-container');
                    if (containerElement) {
                        containerElement.__quill = quill;
                    }
                    
                    // Add custom buttons to toolbar after initialization
                    $timeout(function() {
                        // Quill creates the toolbar automatically, find it
                        var toolbarContainer = element[0].querySelector('.ql-toolbar');
                        
                        if (toolbarContainer) {
                            // Create custom button group
                            var customGroup = document.createElement('span');
                            customGroup.className = 'ql-formats';
                            
                            // Emoji button
                            var emojiBtn = document.createElement('button');
                            emojiBtn.type = 'button';
                            emojiBtn.className = 'ql-emoji';
                            emojiBtn.innerHTML = '<i class="bi bi-emoji-smile"></i>';
                            emojiBtn.title = 'Emoji';
                            emojiBtn.addEventListener('click', function(e) {
                                e.preventDefault();
                                scope.$apply(function() {
                                    scope.toggleEmojiPicker();
                                });
                            });
                            customGroup.appendChild(emojiBtn);
                            
                            // Hashtag button
                            var hashtagBtn = document.createElement('button');
                            hashtagBtn.type = 'button';
                            hashtagBtn.className = 'ql-hashtag';
                            hashtagBtn.innerHTML = '<i class="bi bi-hash"></i>';
                            hashtagBtn.title = 'Hashtag';
                            hashtagBtn.addEventListener('click', function(e) {
                                e.preventDefault();
                                scope.$apply(function() {
                                    scope.insertHashtag();
                                });
                            });
                            customGroup.appendChild(hashtagBtn);
                            
                            // Mention button
                            var mentionBtn = document.createElement('button');
                            mentionBtn.type = 'button';
                            mentionBtn.className = 'ql-mention';
                            mentionBtn.innerHTML = '<i class="bi bi-at"></i>';
                            mentionBtn.title = 'Mention';
                            mentionBtn.addEventListener('click', function(e) {
                                e.preventDefault();
                                scope.$apply(function() {
                                    scope.insertMention();
                                });
                            });
                            customGroup.appendChild(mentionBtn);
                            
                            toolbarContainer.appendChild(customGroup);
                            
                            // Also manually attach link button handler as fallback
                            var linkBtn = toolbarContainer.querySelector('.ql-link');
                            if (linkBtn) {
                                // Remove any existing listeners by cloning
                                var newLinkBtn = linkBtn.cloneNode(true);
                                linkBtn.parentNode.replaceChild(newLinkBtn, linkBtn);
                                
                                newLinkBtn.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    scope.$apply(function() {
                                        scope.toggleLinkPopup();
                                    });
                                });
                            }
                        }
                    }, 100);
                    
                    // Set initial content
                    if (ngModel.$viewValue) {
                        var content = ngModel.$viewValue;
                        // If content is HTML, set it directly
                        if (content && (content.indexOf('<') > -1 || content.indexOf('&lt;') > -1)) {
                            quill.root.innerHTML = content;
                        } else {
                            quill.setText(content || '');
                        }
                    }
                    
                    // Update model when Quill content changes
                    quill.on('text-change', function() {
                        if (!isUpdating) {
                            isUpdating = true;
                            var content = quill.root.innerHTML;
                            var text = quill.getText();
                            
                            ngModel.$setViewValue(content);
                            if (scope.onUpdate) {
                                scope.$apply(function() {
                                    // Pass HTML content, not plain text
                                    scope.onUpdate({ content: content });
                                });
                            }
                            
                            $timeout(function() {
                                isUpdating = false;
                            }, 0);
                        }
                    });
                }
                
                // Render function for ngModel
                ngModel.$render = function() {
                    if (!isUpdating && quill && ngModel.$viewValue) {
                        var content = ngModel.$viewValue;
                        if (content && (content.indexOf('<') > -1 || content.indexOf('&lt;') > -1)) {
                            quill.root.innerHTML = content;
                        } else {
                            quill.setText(content || '');
                        }
                    }
                };
                
                // Insert text at cursor
                function insertTextAtCursor(text) {
                    if (!quill) return;
                    var range = quill.getSelection(true);
                    if (!range) {
                        // No selection, insert at end
                        var length = quill.getLength();
                        quill.insertText(length - 1, text, 'user');
                        quill.setSelection(length - 1 + text.length);
                    } else {
                        quill.insertText(range.index, text, 'user');
                        quill.setSelection(range.index + text.length);
                    }
                }
                
                // Insert hashtag
                scope.insertHashtag = function () {
                    if (scope.showEmojiPicker) {
                        scope.closeEmojiPicker();
                    }
                    if (scope.showLinkPopup) {
                        scope.closeLinkPopup();
                    }
                    insertTextAtCursor('#');
                };
                
                // Insert mention
                scope.insertMention = function () {
                    if (scope.showEmojiPicker) {
                        scope.closeEmojiPicker();
                    }
                    if (scope.showLinkPopup) {
                        scope.closeLinkPopup();
                    }
                    insertTextAtCursor('@');
                };
                
                // Toggle emoji picker
                scope.toggleEmojiPicker = function (event) {
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    if (scope.showLinkPopup) {
                        scope.closeLinkPopup();
                    }
                    scope.showEmojiPicker = !scope.showEmojiPicker;
                    if (scope.showEmojiPicker) {
                        updateEmojiPickerPosition();
                        $timeout(function() {
                            if (quill) quill.focus();
                            scope.emojiPickerReady = true;
                        }, 100);
                    } else {
                        scope.emojiPickerReady = false;
                    }
                };
                
                // Close emoji picker
                scope.closeEmojiPicker = function () {
                    scope.showEmojiPicker = false;
                    scope.emojiPickerReady = false;
                };
                
                // Set active category
                scope.setCategory = function (category) {
                    scope.activeCategory = category;
                };
                
                // Get current category emojis
                scope.getCurrentCategoryEmojis = function () {
                    return emojiData[scope.activeCategory] || emojiData.smileys;
                };
                
                // Select emoji
                scope.selectEmoji = function (emoji) {
                    insertTextAtCursor(emoji);
                    scope.closeEmojiPicker();
                    if (quill) quill.focus();
                };
                
                // Update emoji picker position
                function updateEmojiPickerPosition() {
                    $timeout(function() {
                        var toolbar = element[0].querySelector('.ql-toolbar');
                        var emojiBtn = element[0].querySelector('.ql-emoji');
                        if (toolbar && emojiBtn) {
                            var rect = emojiBtn.getBoundingClientRect();
                            var toolbarRect = toolbar.getBoundingClientRect();
                            scope.emojiPickerStyle = {
                                top: (rect.bottom - toolbarRect.top) + 'px',
                                left: (rect.left - toolbarRect.left) + 'px'
                            };
                        }
                    }, 0);
                }
                
                // Toggle link popup
                scope.toggleLinkPopup = function (event) {
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    if (scope.showEmojiPicker) {
                        scope.closeEmojiPicker();
                    }
                    scope.showLinkPopup = !scope.showLinkPopup;
                    if (scope.showLinkPopup) {
                        updateLinkPopupPosition();
                        $timeout(function() {
                            if (quill) quill.focus();
                            var urlInput = element[0].querySelector('.link-popup-input');
                            if (urlInput) {
                                try {
                                    urlInput.focus();
                                } catch (e) {
                                    // Ignore browser extension errors
                                }
                            }
                            
                            // Attach direct click handler to submit button when popup is shown
                            var submitBtn = element[0].querySelector('.link-popup-btn-submit');
                            if (submitBtn) {
                                // Remove any existing listeners by cloning
                                var newSubmitBtn = submitBtn.cloneNode(true);
                                submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
                                
                                newSubmitBtn.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Submit button clicked directly');
                                    console.log('Current linkUrl value:', scope.linkUrl);
                                    if (scope && scope.submitLink) {
                                        scope.$apply(function() {
                                            // Get the value directly from the input element as fallback
                                            var inputElement = element[0].querySelector('.link-popup-input');
                                            if (inputElement && inputElement.value && !scope.linkUrl) {
                                                scope.linkUrl = inputElement.value;
                                                console.log('Updated linkUrl from input element:', scope.linkUrl);
                                            }
                                            scope.submitLink();
                                        });
                                    }
                                });
                            }
                            
                            scope.linkPopupReady = true;
                        }, 50);
                    } else {
                        scope.linkPopupReady = false;
                        scope.linkUrl = '';
                    }
                };
                
                // Close link popup
                scope.closeLinkPopup = function (event) {
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    if (scope.linkPopupReady !== false) {
                        scope.showLinkPopup = false;
                        scope.linkPopupReady = false;
                        scope.linkUrl = '';
                    }
                };
                
                // Submit link
                scope.submitLink = function () {
                    console.log('submitLink called, linkUrl:', scope.linkUrl);
                    
                    // Fallback: get value directly from input element if ng-model didn't update
                    if (!scope.linkUrl || scope.linkUrl.trim() === '') {
                        var inputElement = element[0].querySelector('.link-popup-input');
                        if (inputElement && inputElement.value) {
                            scope.linkUrl = inputElement.value;
                            console.log('Got URL from input element:', scope.linkUrl);
                        }
                    }
                    
                    if (!scope.linkUrl || scope.linkUrl.trim() === '') {
                        console.log('No URL provided');
                        return;
                    }
                    
                    if (!quill) {
                        console.error('Quill instance not available');
                        return;
                    }
                    
                    try {
                        var url = scope.linkUrl.trim();
                        console.log('Processing URL:', url);
                        
                        // Add http:// if no protocol specified
                        if (!url.match(/^https?:\/\//i)) {
                            url = 'http://' + url;
                        }
                        
                        console.log('Final URL:', url);
                        
                        // Get current selection
                        var range = quill.getSelection(true);
                        console.log('Current selection:', range);
                        
                        if (range && range.length > 0) {
                            // There's selected text, format it as a link
                            console.log('Formatting selected text as link');
                            quill.formatText(range.index, range.length, 'link', url, 'user');
                            // Keep the selection
                            quill.setSelection(range.index, range.length);
                        } else {
                            // No selection, insert URL as text and format it as a link
                            var insertIndex = range && range.index !== null ? range.index : (quill.getLength() - 1);
                            if (insertIndex < 0) insertIndex = 0;
                            
                            console.log('Inserting link at index:', insertIndex);
                            
                            // Insert text first
                            quill.insertText(insertIndex, url, 'user');
                            // Then format the inserted text as a link
                            quill.formatText(insertIndex, url.length, 'link', url, 'user');
                            // Set cursor after the inserted link
                            quill.setSelection(insertIndex + url.length, 'user');
                            
                            console.log('Link inserted successfully');
                        }
                        
                        // Close popup and clear URL
                        scope.closeLinkPopup();
                        
                        // Keep focus on editor
                        $timeout(function() {
                            if (quill) quill.focus();
                        }, 50);
                    } catch (error) {
                        console.error('Error inserting link:', error);
                        console.error('Error stack:', error.stack);
                        // Still close the popup even if there's an error
                        scope.closeLinkPopup();
                    }
                };
                
                // Handle keydown in link popup
                scope.handleLinkKeydown = function (event) {
                    if (event.stopImmediatePropagation) {
                        event.stopImmediatePropagation();
                    }
                    
                    if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        scope.submitLink();
                    } else if (event.key === 'Escape') {
                        event.preventDefault();
                        scope.closeLinkPopup();
                    }
                };
                
                // Handle input events with error suppression
                // Note: We don't stop propagation here to allow Angular to update ng-model
                scope.handleLinkInput = function (event) {
                    // Just suppress browser extension errors, but allow Angular to process the input
                    // The ng-model binding will handle the update
                };
                
                // Attach event listeners to link input and submit button
                $timeout(function() {
                    var urlInput = element[0].querySelector('.link-popup-input');
                    if (urlInput) {
                        // Only prevent browser extensions on focus, not on input events
                        // Input events need to propagate for Angular ng-model to work
                        ['focus'].forEach(function(eventType) {
                            urlInput.addEventListener(eventType, function(e) {
                                if (e.stopImmediatePropagation) {
                                    e.stopImmediatePropagation();
                                }
                            }, true);
                        });
                    }
                    
                    // Also attach direct click handler to submit button as fallback
                    var submitBtn = element[0].querySelector('.link-popup-btn-submit');
                    if (submitBtn) {
                        submitBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Submit button clicked directly');
                            if (scope && scope.submitLink) {
                                scope.$apply(function() {
                                    scope.submitLink();
                                });
                            }
                        });
                    }
                }, 500);
                
                // Update link popup position
                function updateLinkPopupPosition() {
                    $timeout(function() {
                        var linkBtn = element[0].querySelector('.ql-link');
                        if (linkBtn) {
                            var rect = linkBtn.getBoundingClientRect();
                            var popupWidth = 360; // Match CSS width
                            var popupHeight = 180; // Approximate height
                            var margin = 8;
                            
                            // Calculate position relative to viewport (for fixed positioning)
                            var top = rect.bottom + margin;
                            var left = rect.left;
                            
                            // Check if popup would go off right edge
                            if (left + popupWidth > window.innerWidth) {
                                left = window.innerWidth - popupWidth - margin;
                            }
                            
                            // Check if popup would go off bottom edge
                            if (top + popupHeight > window.innerHeight) {
                                // Position above the button instead
                                top = rect.top - popupHeight - margin;
                            }
                            
                            // Ensure popup doesn't go off left edge
                            if (left < margin) {
                                left = margin;
                            }
                            
                            // Ensure popup doesn't go off top edge
                            if (top < margin) {
                                top = margin;
                            }
                            
                            scope.linkPopupStyle = {
                                top: top + 'px',
                                left: left + 'px'
                            };
                        }
                    }, 0);
                }
                
                // Cleanup on destroy
                scope.$on('$destroy', function() {
                    if (quill) {
                        quill = null;
                    }
                });
            }
        };
    }
})();
