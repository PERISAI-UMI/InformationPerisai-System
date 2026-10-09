import Image from "next/image";

export interface MemberCardProps {
  member: {
    id: string;
    name: string;
    nim?: string | null;
    faculty?: string | null;
    roleOrTitle: string;
    avatarUrl?: string | null;
    department?: { name: string; code?: string | null } | null;
  };
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5 text-center shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[#E6AF2E] shadow-sm bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={member.avatarUrl || "/og-default.jpg"}
          alt={member.name}
          width={96}
          height={96}
          className="h-full w-full object-cover"
        />
      </div>
      <h4 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
        {member.name}
      </h4>
      <p className="text-xs font-bold text-[#E6AF2E] dark:text-[#F5D061]">
        {member.roleOrTitle}
      </p>
      {member.department && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {member.department.name}
        </p>
      )}
      {member.faculty && (
        <p className="text-[11px] text-zinc-400">
          {member.faculty}
        </p>
      )}
    </div>
  );
}
