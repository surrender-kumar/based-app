import { notFound } from "next/navigation";
import { getChannelById } from "../../../lib/actions/channels";

interface ChannelPageProps {
  params: {
    channelId: string;
  };
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channelId } = params;
  
  try {
    const { success, data: channel, error } = await getChannelById(channelId);
    
    if (!success || !channel) {
      notFound();
    }
    
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">{channel.name}</h1>
            {channel.description && (
              <p className="text-sm text-gray-500 mb-6">{channel.description}</p>
            )}
            
            {/* Messages will be implemented in step 8 */}
            <div className="text-gray-500 py-12 flex flex-col items-center justify-center">
              <p className="text-sm">No messages yet.</p>
              <p className="text-xs mt-1">
                This is the beginning of the #{channel.name} channel.
              </p>
            </div>
          </div>
        </div>
        
        {/* Message input will be implemented in step 8 */}
        <div className="p-4 border-t">
          <div className="rounded-md border p-2 flex items-center">
            <input
              type="text"
              placeholder={`Message #${channel.name}`}
              className="flex-1 bg-transparent focus:outline-none text-sm"
              disabled
            />
            <button
              className="ml-2 text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
              disabled
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Message functionality will be implemented in step 8
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching channel:", error);
    return notFound();
  }
} 