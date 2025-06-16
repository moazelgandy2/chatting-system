import React, { memo } from "react"; // Import memo
import { Video, Edit3, X, Calendar, Package, User } from "lucide-react";
import { type ClientRemainingLimitItem } from "@/hooks/use-client-remaining-limits"; // Import the type

interface PackageLimitsCardProps {
  data: ClientRemainingLimitItem | null | undefined; // Use the imported type and allow for null/undefined
}

const PackageLimitsCardComponent: React.FC<PackageLimitsCardProps> = ({
  // Renamed to avoid conflict
  data,
}) => {
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  console.log("PackageLimitsCard data:", data);

  const getItemTypeIcon = (
    type: string | undefined | null
  ): React.ReactElement => {
    switch (type?.toLowerCase()) {
      case "videos":
        return <Video className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getItemTypeColor = (type: string | undefined | null): string => {
    switch (type?.toLowerCase()) {
      case "videos":
        return "from-red-500 to-pink-500";
      default:
        return "from-blue-500 to-purple-500";
    }
  };

  // Handle null or undefined data, or data without a valid id
  if (!data || data.id == null) {
    return (
      <div className="w-80 bg-gray-800 rounded-xl p-4 border-2 border-dashed border-gray-600">
        <div className="text-center text-gray-400">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No Package Data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg bg-gradient-to-r ${getItemTypeColor(
              data.item_type
            )} text-white shadow-md`}
          >
            {getItemTypeIcon(data.item_type)}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{data.item_type}</h3>
            <p className="text-xs text-gray-400">ID: {data.id}</p>
          </div>
        </div>
      </div>

      {/* Limits */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800 rounded-lg p-3 border border-green-500/30">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-3 h-3 text-green-400" />
            <span className="text-xs font-medium text-green-300">Edits</span>
          </div>
          <p className="text-xl font-bold text-green-400 mt-1">
            {data.edit_limit}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 border border-red-500/30">
          <div className="flex items-center space-x-2">
            <X className="w-3 h-3 text-red-400" />
            <span className="text-xs font-medium text-red-300">Declines</span>
          </div>
          <p className="text-xl font-bold text-red-400 mt-1">
            {data.decline_limit}
          </p>
        </div>
      </div>

      {/* Client Info */}
      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg mb-4">
        <div className="flex items-center space-x-2">
          <User className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">Client</span>
          <span className="font-semibold text-white">{data.client_id}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Package className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">Package</span>
          <span className="font-semibold text-white">
            {data.client_package_id ?? "N/A"}
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center space-x-1 text-gray-400">
          <Calendar className="w-3 h-3" />
          <span className="text-xs">Created</span>
        </div>
        <span className="text-xs font-medium text-gray-300">
          {formatDate(data.created_at)}
        </span>
      </div>
    </div>
  );
};

export const PackageLimitsCard = memo(PackageLimitsCardComponent); // Export the memoized component
