import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../data/index";
import { MapPinIcon, MessageCircleIcon, VideoIcon } from "lucide-react";

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.name} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold truncate">{friend.name}</h3>
            {friend.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {friend.location}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>
        
        {friend.bio && (
          <p className="text-sm opacity-70 mb-3 line-clamp-2">{friend.bio}</p>
        )}
        
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-primary btn-sm flex-1"
          >
            <MessageCircleIcon className="size-4 mr-1" />
            Chat
          </Link>
          <Link to={`/call/${friend._id}`} className="btn btn-outline btn-sm">
            <VideoIcon className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
