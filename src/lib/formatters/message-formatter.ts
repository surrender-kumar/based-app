/**
 * Message formatter utility for converting markdown-like syntax to HTML
 */

// Regular expressions for different formats
const BOLD_REGEX = /\*\*(.*?)\*\*/g;
const ITALIC_REGEX = /\*(.*?)\*/g;
const STRIKETHROUGH_REGEX = /~~(.*?)~~/g;
const CODE_REGEX = /`(.*?)`/g;
// Use a workaround for multi-line regex without 's' flag
const CODE_BLOCK_REGEX = /```([^]*?)```/g;
const LINK_REGEX = /\[(.*?)\]\((.*?)\)/g;
const MENTION_REGEX = /@(\w+)/g;
const CHANNEL_REGEX = /#(\w+)/g;

/**
 * Format a message with markdown-like syntax
 * @param text Raw message text
 * @returns HTML formatted text
 */
export function formatMessage(text: string): string {
  if (!text) return '';
  
  // Escape HTML first to prevent injection
  let formatted = escapeHtml(text);
  
  // Apply formatting
  formatted = formatted
    // Code blocks first (multi-line)
    .replace(CODE_BLOCK_REGEX, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(CODE_REGEX, '<code>$1</code>')
    // Bold
    .replace(BOLD_REGEX, '<strong>$1</strong>')
    // Italic
    .replace(ITALIC_REGEX, '<em>$1</em>')
    // Strikethrough
    .replace(STRIKETHROUGH_REGEX, '<del>$1</del>')
    // Links
    .replace(LINK_REGEX, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Mentions
    .replace(MENTION_REGEX, '<span class="mention">@$1</span>')
    // Channels
    .replace(CHANNEL_REGEX, '<span class="channel">#$1</span>');
  
  // Replace new lines with <br>
  formatted = formatted.replace(/\n/g, '<br />');
  
  return formatted;
}

/**
 * Parse mentions from a message
 * @param text Raw message text
 * @returns Array of mentioned usernames
 */
export function parseMentions(text: string): string[] {
  if (!text) return [];
  
  const mentions = [];
  let match;
  
  while ((match = MENTION_REGEX.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

/**
 * Parse channels from a message
 * @param text Raw message text
 * @returns Array of mentioned channel names
 */
export function parseChannels(text: string): string[] {
  if (!text) return [];
  
  const channels = [];
  let match;
  
  while ((match = CHANNEL_REGEX.exec(text)) !== null) {
    channels.push(match[1]);
  }
  
  return channels;
}

/**
 * Escape HTML to prevent injection
 * @param text Text to escape
 * @returns Escaped text
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Remove formatting from text
 * @param text Formatted text
 * @returns Plain text
 */
export function stripFormatting(text: string): string {
  if (!text) return '';
  
  return text
    .replace(BOLD_REGEX, '$1')
    .replace(ITALIC_REGEX, '$1')
    .replace(STRIKETHROUGH_REGEX, '$1')
    .replace(CODE_REGEX, '$1')
    .replace(CODE_BLOCK_REGEX, '$1')
    .replace(LINK_REGEX, '$1')
    .replace(MENTION_REGEX, '@$1')
    .replace(CHANNEL_REGEX, '#$1');
} 