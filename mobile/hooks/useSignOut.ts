import { useClerk } from "@clerk/clerk-expo";
import { Alert } from "react-native";

export const useSignOut = () => {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            // The AuthWrapper in _layout.tsx will automatically redirect to login
            console.log("User signed out successfully");
          } catch (error) {
            console.error("Error during sign out:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  return { handleSignOut };
};
