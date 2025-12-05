import RowActions from "@/components/stockMovements/RowActions";
import { getAvatarInitials, getAvatarStyle } from "@/lib/avatarUtils";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  duty: string;
  role: string;
  status: string;
  createdAt: string;
  avatarColor?: string;
}

interface StaffTableProps {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export default function StaffTable({
  employees,
  loading,
  onEdit,
  onDelete,
}: StaffTableProps) {
  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>;
  }

  if (employees.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">No employees found.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Phone
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Duty
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Created at
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {employees.map((emp) => {
            return (
              <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${getAvatarStyle(
                        emp.avatarColor
                      )}`}
                    >
                      {getAvatarInitials(emp.name)}
                    </div>
                    <span className="font-medium text-gray-900">
                      {emp.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{emp.email}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{emp.phone}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{emp.duty}</td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {emp.createdAt}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      emp.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <RowActions
                    onEdit={() => onEdit(emp)}
                    onDelete={() => onDelete(emp.id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
