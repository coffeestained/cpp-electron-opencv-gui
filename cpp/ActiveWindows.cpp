#include <windows.h>
#include <psapi.h>
#include <string>
#include <vector>
#include <sstream>
#include <iostream>

extern "C" __declspec(dllexport) const char* GetActiveWindows() {
    static std::string result;
    result.clear();

    std::vector<HWND> hwnds;
    std::vector<std::string> titles;

    EnumWindows([](HWND hwnd, LPARAM lParam) -> BOOL {
        char title[256];
        if (GetWindowTextA(hwnd, title, sizeof(title)) > 0) {
            DWORD pid;
            GetWindowThreadProcessId(hwnd, &pid);
            if (IsWindowVisible(hwnd)) {
                std::ostringstream oss;
                oss << "[PID: " << pid << "] " << title;
                ((std::vector<std::string>*)lParam)->push_back(oss.str());
            }
        }
        return TRUE;
    }, (LPARAM)&titles);

    for (const auto& title : titles) {
        result += title + "\n";
    }

    return result.c_str();
}
