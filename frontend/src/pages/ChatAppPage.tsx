import Logout from "@/components/auth/logout";
import { useAuthStore } from "@/stores/useAuthStore";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user); // chỉ theo dõi riêng user
  return (
    <div className="">
      {user.username}
      <Logout />
    </div>
  );
};

export default ChatAppPage;
