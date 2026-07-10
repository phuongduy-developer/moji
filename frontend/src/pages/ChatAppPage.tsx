import Logout from "@/components/auth/logout";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user); // chỉ theo dõi riêng user
  const handleTest = async () => {
    try {
      const res = await authService.test();

      toast.success(res);
    } catch (error) {
      toast.error("Thất bại");
      console.error(error);
    }
  };
  return (
    <div className="">
      {user.username}
      <Logout />
      <Button variant="outline" size="lg" onClick={handleTest}>
        test
      </Button>
    </div>
  );
};

export default ChatAppPage;
