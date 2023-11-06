import {LitElement, css, html, unsafeHTML, map} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class RSSFeed extends LitElement {
  constructor() {
    super();
    this.feedId = this.getAttribute('url');
		this.readEntries = this.getReadEntries();
		this.readCount = this.getReadCount();
  };

	static properties = {
    feed: {state: true},
		readEntries: {state: true},
		readCount: {state: true},
  };

	async connectedCallback() {
		super.connectedCallback();
		await this.fetchFeed(this.feedId);
	};

	async fetchFeed(url) {
		const parseFeedResponse = (feedContent) => {
			return new window.DOMParser().parseFromString(feedContent, "text/xml");
		};

		const handleParsedFeedResults = (results) => {
			this.feed = results;
			return results;
		};

		return await fetch(url).then(resp => {
			if (!resp.ok) throw new Error('network error');
			return resp.text();
		})
		.then(parseFeedResponse)
		.then(handleParsedFeedResults)
		.catch(error => {
			console.log('error', error.message, error);
		});
	};

	getReadCount() {
		return this.readEntries.length;
	};

	getReadEntries() {
		let lsEntries = window.localStorage.getItem(`dashboard_rss_readEntries_${this.feedId}`);
		if (lsEntries === null) {
			lsEntries = [];
		} else {
			lsEntries = lsEntries.split(';');
		}
		return lsEntries;
	};

	saveReadEntries() {
		return window.localStorage.setItem(`dashboard_rss_readEntries_${this.feedId}`, this.readEntries.join(';'));
	};

	updateReadEntries(newReadEntries) {
		this.readEntries = Array.from(newReadEntries);
	};

	addReadEntry(entry) {
		const readEntries = new Set([...this.readEntries, entry]);
		this.updateReadEntries(readEntries);
		this.saveReadEntries();
	};

	unreadEntry(entry) {
		const readEntries = new Set([...this.readEntries]);
		readEntries.delete(entry);
		this.updateReadEntries(readEntries);
		this.saveReadEntries();
	};

	getShareObject(entry) {
		const feedItems = Array.from(this.feed.querySelectorAll('channel > item'));
		const title = this.feed.querySelector('channel > title').innerHTML;
		const sharedEntry = feedItems.filter(item => item.querySelector('guid').innerHTML === entry)[0];
		const text = sharedEntry.querySelector('title').innerHTML;
		return {
			title,
			text,
			url: entry,
		}
	}

	async handleShare(e) {
		const feedItem = e.target.closest('details');
		const shareObject = this.getShareObject(feedItem.dataset.id);
		try {
			return await navigator.share(shareObject);
		} catch (err) {
			console.log(err);
		}
	};

	handleToggle(e) {
		const feedItem = e.target
		if (feedItem.open) {
			this.addReadEntry(feedItem.dataset.id);
		}
	};

	handleMarkUnread(e) {
		this.unreadEntry(e.target.closest('details').dataset.id);
	};

  render() {
		return this.feed
    	? html`<link rel="stylesheet" href="/css/feed.css"/>
				<div class="feed">
				${map(this.feed.querySelectorAll('channel > item'), (item) => {
					const title = item.querySelector('title').innerHTML;
					const id = item.querySelector('guid').innerHTML;
					const isRead = (this.readEntries.includes(id) ? 'read' : 'unread');
					const post = item.querySelector('description').innerHTML.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
					return html`<details class="feed__entry" data-state="${(isRead)}" data-id="${id}" @toggle="${this.handleToggle}">
					<summary class="feed__entry-summary">
						<div class="feed__icon-wrapper">
							<svg class="feed__entry-icon" data-icon="summary" viewBox="0 0 24 24"><path d="M2,20V22H22V20H13V5.83L18.5,11.33L19.92,9.92L12,2L4.08,9.92L5.5,11.33L11,5.83V20H2Z" /></svg>
							<svg class="feed__entry-icon" data-icon="summary" viewBox="0 0 24 24"><path d="M22,4V2H2V4H11V18.17L5.5,12.67L4.08,14.08L12,22L19.92,14.08L18.5,12.67L13,18.17V4H22Z" /></svg>
						</div>
						<span class="feedItem_title">${title}</span>
					</summary>
					<div class="feed__post">
						<div class="feed__post-content">
							${unsafeHTML(post)}
						</div>
						<div class="feed__post-controls">
							<button ${(isRead === 'unread' ? 'disabled' : '')} @click="${this.handleMarkUnread}" class="feed__post-control" aria-label="Save as unread"><svg class="feed__entry-icon" width="24" height="24" viewBox="0 0 24 24"><path d="M7,2V13H10V22L17,10H13L17,2H7Z" /></svg></button>
							<button @click="${this.handleShare}" class="feed__post-control" aria-label="Share post"><svg class="feed__entry-icon" width="24" height="24" viewBox="0 0 24 24"><path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" /></svg></button>
						</div>
					</div>
				</details>`;
				})}
			</div>`
    	: html`<p>fetching</p>`;
  };
}
customElements.define('rss-feed', RSSFeed);
