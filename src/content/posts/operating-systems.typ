#import "../../pages/post.typ": *

#metadata((
  title: [How to Make an OS],
  date: datetime(year: 2023, month: 2, day: 2),
  lastmod: datetime(year: 2023, month: 2, day: 5),
))
#show: post

#note(
  title: [DISCLAIMERS],
)[
  1. This post is based on my own personal experience using Windows and various Linux distributions, and may not reflect your experience with it.

  2. Many of the things I talk about here might be possible to change by messing around with different configurations and system files in the OSes, but that's not something I am willing to do, and neither are most people. Default settings matter a lot, and that is what I'm going to focus on.

  3. I may mention certain things that certain OSes do well, and that others don't. This doesn't mean I'm biased towards or against something. I'm not sponsored by any companies or organisations, and there is no reason for me to praise something unless I really believe it's good, or point out concerns I don't think are valid.

  4. This post may be a bit more technical than my other ones, so if you're feeling a bit lost with what I'm talking about, don't worry it's not your fault.

  5. I don't care if you think it's Linux or GNU/Linux, I'm saying Linux.
]

When I'm looking for an OS to use for every day of my life for the next few years, there's certain criteria I want it to meet. It should be:

- simple,

- stable,

- secure, and

- up to date.

It's not quite as easy as that, since all 4 of those tie into each other. For instance, an up to date package is generally more secure, but might lead to instability if it hasn't been tested properly on the OS.

= Simple

This is one of the main drawbacks with Linux distributions. Contrary to what many people may tell you, Linux is not always simple to use or understand, especially if you're coming from something like Windows or macOS. It's certainly better than it was a few years ago, but there are still many things that don't always work how you would expect them to.

== Distributions

Linux itself isn't an OS, it's a kernel, which is just the core of an OS and helps communication between hardware and software. For it to be a full-featured OS, there has to be additions made on top of it to allow users to use it. Windows uses the #link("https://en.wikipedia.org/wiki/Architecture_of_Windows_NT")[Windows NT kernel], while all Apple operating systems use their #link("https://opensource.apple.com/source/xnu/")[open source] #link("https://en.wikipedia.org/wiki/XNU")[XNU kernel]. #link("https://source.android.com/docs/core/architecture/kernel")[Android] and ChromeOS both use a modified Linux kernel.

Hence, for an OS to be usable, there needs to be tools and software surrounding the kernel, such as a UI. In the world of Linux, this is known as a #link("https://www.suse.com/suse-defines/definition/linux-distribution/")[distribution], or distro. As Linux is #link("https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git")[free and open source], this allows anyone to build upon it and create their own distro. However, when you give people that much freedom, #link("https://en.wikipedia.org/wiki/Linux_distribution#/media/File:Linux_Distribution_Timeline_21_10_2021.svg")[you get a mess] of everyone forking each other to create distros that each solve one particular problem they had with the original.

As an example of that, here's a small list of distros available to you#super[1]:

- #link("https://www.debian.org/")[Debian]

  - #link("https://ubuntu.com/")[Ubuntu]

    - #link("https://kubuntu.org/")[Kubuntu]

    - #link("https://lubuntu.me/")[Lubuntu]

    - #link("https://xubuntu.org/")[Xubuntu]

    - #link("https://elementary.io/")[ElementaryOS]

    - #link("https://vanillaos.org/")[VanillaOS]

    - #link("https://linuxmint.com/")[Linux Mint]

    - #link("https://www.linuxliteos.com/")[Linux Lite]

    - #link("https://pop.system76.com/")[Pop!\_OS]

  - #link("https://www.devuan.org/")[Devuan]

- #link("https://getfedora.org/")[Fedora]

  - #link("https://nobaraproject.org/")[Nobara]

- #link("https://www.centos.org/")[CentOS]

- #link("https://www.gentoo.org/")[Gentoo]

  - #link("https://www.funtoo.org/Welcome")[Funtoo]

- #link("https://archlinux.org/")[Arch Linux]

  - #link("https://manjaro.org/")[Manjaro]

  - #link("https://garudalinux.org/")[Garuda Linux]

  - #link("https://endeavouros.com/")[EndeavourOS]

- #link("https://www.opensuse.org/")[OpenSUSE]

- #link("https://getsol.us/")[Solus]

== Package managers

So you've chosen a distro that you're happy with. This will usually bring with it a distro-maintained #link("https://www.debian.org/doc/manuals/aptitude/pr01s02.en.html")[package manager], which means that the people running the distribution are responsible for keeping the packages in it up to date, while also making sure everything is stable.

However, there are #link("#linux-1")[many, many package managers] out there, and none are compatible with each other. In the Debian family, you have dpkg. The Red Hat distros use RPM, while Arch uses Pacman. Even Windows has their own package manager, called #link("https://learn.microsoft.com/en-us/windows/package-manager/")[winget]. And that's not even mentioning the third-party package managers, like Flatpak and Snap on Linux, Scoop and Chocolatey on Windows, and Homebrew on macOS. Within package managers, you also have both first-party repositories, which come from the OS itself, and #link("https://www.ubuntubuzz.com/2017/01/ubuntu-package-management-part-4-ppa-and-third-party-repository.html")[third-party repositories], like the Arch User Repository (AUR) and Personal Package Archives (PPA) on Ubuntu, which bring about their own benefits and drawbacks.

#quote(
  title: [Bjørn Erik Pedersen, Hugo developer],
  href: "https://discourse.gohugo.io/t/add-flatpak-support/13734/3",
)[
  It would be cool if the Linux world would agree on 1 app manager.
]

This is one of the main reasons Linux can be so complicated. Furthermore, the GUI software stores, like GNOME Software or KDE Discover are often #link("https://bugzilla.redhat.com/show_bug.cgi?id=2022755")[clunky] and #link("https://www.reddit.com/r/kde/comments/qoo7gv/why_is_discover_so_unresponsive_and_buggy/")[difficult to use], and sometimes don't have all of the packages available in the repositories.

Then you also have Flatpaks and Snaps, which have their own repositories and in the case of Snaps, their #link("https://snapcraft.io/docs/installing-snap-store-app")[own software store]. AppImages (yet another package format) don't even have an official repository, and just exist on their own, further adding to the mess.

== UI

Most Linux distributions provide a GUI on first install, however some like Arch drop you into a command line when you first boot them up. While CLI is quite standardised, since there's not much to customise in the first place, there is a _lot_ of fragmentation in GUIs, on pretty much all OSes.

Windows uses their #link("https://learn.microsoft.com/en-us/windows/apps/winui/")[WinUI framework] to build apps that follow #link("https://www.microsoft.com/design/fluent/#/")[Fluent Design]. Apple's OSes use the #link("https://developer.apple.com/documentation/swiftui")[SwiftUI] framework to design their UIs that follow their #link("https://developer.apple.com/design/human-interface-guidelines/guidelines/overview/")[Human Interface Guidelines]. Google follows #link("https://material.io")[Material Design] for their UIs.

On Linux distributions and BSDs, you have 2 main toolkits for making UIs: #link("https://www.gtk.org/")[GTK] and #link("https://www.qt.io/")[Qt]. Different desktop environments (DE) #link("https://wiki.archlinux.org/title/Comparison_of_desktop_environments")[use different toolkits] to make their UIs and designs. DEs like GNOME, Budgie, Cinnamon, Xfce, and Pantheon use GTK theming for their apps and programs, while others like KDE, LXQt and Deepin use Qt. While it's possible to install Qt programs while using a GTK-based DE, they may look out of place, and vice versa.

This isn't really an advantage or drawback for any OS, since design and UI are very subjective. That being said, I do commend Linux distros and Android for giving users much more freedom to customise their OS to their own desires compared to the other, more locked-down OSes.

= Stable

This is arguably one of the more important criteria, for average and techy users alike. Regardless of how technically knowledgable you may be, no one likes to have to sit around fixing bugs and issues on their computer every day. Unix-like systems, like Apple's and Google's OSes, and most Linux distributions, take an easy win here, since the Unix base is famed for its stability. That's why #link("https://www.redhat.com/en/blog/red-hat-continues-lead-linux-server-market")[most servers in the world] are running Linux (although server Linux is different than desktop Linux), and why smartphone OSes are so difficult to break if you're not rooting or jailbreaking them.

There are only a handful of OSes that don't meet this: a few Linux distributions and Windows.

== Windows

Every single major release of Windows seems to be #link("https://www.tomsguide.com/news/windows-11-problems-and-fixes-everything-we-know-so-far#windows-11-issues-cheat-sheet")[more and more unstable] than the last. #link("https://answers.microsoft.com/en-us/windows/forum/all/windows-11-general-instability-and-low-performance/43757897-646f-4bc0-a225-1676099df00e")[Windows 11] was worse than 10. #link("https://jgwallis.github.io/post/windows-10-instability/")[Windows 10] was worse than 7. #link("https://www.computerworld.com/article/2760904/windows-7-stability-update-makes-pcs-unstable--users-report.html")[Windows 7] had its own issues. However, seeing as millions of people use it every day without any problems, it's fair to give it the benefit of the doubt.

== Linux

Most Linux distros have stability down, and the kernel itself, which is #link("https://www.ionos.co.uk/digitalguide/server/know-how/unix-vs-linux/")[Unix-like], is very stable. However, certain distributions are more prone to breaking than others, usually due to the way they handle packages and updates.

Distributions that follow a #link("#up-to-date")[rolling release cycle] tend to have more issues with stability than others with a slower, more stable release cycle. Rolling release means your packages are always up to date and on the bleeding edge, which has its advantanges, but also means that the software is often relatively untested and may have dependencies that you may not have installed or updated yet. Rolling release distros like Arch or OpenSUSE suffer from this, while others like Debian which follow a _much_ slower release cycle are much more stable. However, that comes at a cost of security.

= Secure

If you're using an OS, I think it's safe to assume you wouldn't want to be hacked. Most mainstream OSes are pretty secure, and will prevent most threats from ever reaching or affecting you. #link("https://madaidans-insecurities.github.io/android.html")[Android] and #link("https://support.apple.com/en-gb/guide/security/welcome/web")[iOS] are especially good at this, provided you're not unlocking the bootloader, or rooting/jailbreaking the phone. On the desktop side, macOS uses a similar security model as its mobile counterpart, while ChromeOS uses that of Chrome and Android. I've talked about the #link("/posts/google#android-and-chromeos")[security of Android and ChromeOS] in my post about Google.

== Sandboxing

While there's a lot that goes into OS security, one of the main things is application sandboxing. This is essentially a way to isolate user-installed programs in their own "sandbox", so that they can't access files or data from other apps or the system without explicit permission to do so.

Windows also has a decent security model and application sandbox, though it's not as strong as that of Google's or Apple's OSes. Windows has its own permission model, as well as #link("https://learn.microsoft.com/en-us/microsoft-365/security/defender-endpoint/controlled-folders?view=o365-worldwide")[Controlled Folder Access] to prevent apps from accessing #link("https://learn.microsoft.com/en-us/microsoft-365/security/defender-endpoint/controlled-folders?view=o365-worldwide#windows-system-folders-are-protected-by-default")[protected folders] without user permission. All Universal Windows Platform (UWP) apps are #link("https://learn.microsoft.com/en-us/windows/uwp/security/intro-to-secure-windows-app-development#41-windows-app-model")[sandboxed by default] and there is a #link("https://learn.microsoft.com/en-us/windows/security/threat-protection/windows-sandbox/windows-sandbox-overview")[Windows Sandbox] available in Windows to optionally isolate all other programs.

Linux, on the other hand, has #link("https://madaidans-insecurities.github.io/linux.html#sandboxing")[no sandboxing system by default]. Programs like Firejail and Bubblewrap attempt to sandbox applications installed as ```sh sudo``` (the equivalent of admin permissions on Windows), but they #link("https://madaidans-insecurities.github.io/linux.html#firejail")[aren't great] either. The other solution to this problem was Flatpaks, which are a step in the right direction, being sandboxed (provided you don't give them access to your entire home directory) and having a permission model (which gives many Flatpaks #link("https://github.com/search?q=org%3Aflathub+filesystem%3Dhome&type=code")[access to your home directory] by default), come with their own flaws, even in the very #link("https://madaidans-insecurities.github.io/linux.html#flatpak")[sandboxing] they claim to employ.

Not only does Flatpak have weak sandboxing itself, it also weakens the sandboxing in other applications. Chromium, for instance, has #link("/posts/google#chromium")[world-class security], and one of the strongest sandboxing implementations in the browser market. Any Flatpak version of Chromium- or Electron-based apps replace this sandbox with a much weaker one called #link("https://github.com/refi64/zypak")[Zypak], which has about the same strength as Flatpak's own sandbox. This is one of the reasons why it's not recommended to use the Flatpak version of any Chromium-based browser.

= Up to date

This criterion ties in with security, since updates often bring security patches but could also have new vulnerabilities; stability, since newer packages can fix many bugs but also have new ones; and simplicity, since having to manage apps using different package managers can get confusing. This is also the criterion Linux distros seem to have the most trouble with.

== OS package managers

On Windows, macOS and Android, it is the developer's responsibility to build, test and compile their app into a package for the user to install and use, in the form of `.exe`, `.app` and `.apk` files, respectively. The app stores on Windows, macOS, ChromeOS, Android and iOS are also a central "repository" where the developers themselves keep the packages up to date. Android also allows for #link("https://support.google.com/googleplay/answer/13209197?hl=en&ref_topic=3364264")[additional app stores] to be added outside of the default OS app store.

The Windows Package Manager, or winget, has a command structure similar to that of Linux package managers, but instead of pulling from a distro-maintained package, it just pulls the `.exe` file from the official source. For example, running ```sh winget install firefox``` would #link("https://github.com/microsoft/winget-pkgs/blob/master/manifests/m/Mozilla/Firefox/109.0/Mozilla.Firefox.installer.yaml")[get the `.exe` or `.msi` file] from Mozilla's CDN and install that, as if you'd gone to the Firefox website and installed it that way.

== Third-party repositories

=== Windows

Windows has a few third-party repositories, such as #link("https://chocolatey.org/")[Chocolatey] and #link("https://scoop.sh/")[Scoop]. They have their own software maintainers, and in some cases, programs that aren't available in the official winget repos. However, it is not recommended to use these third-party repositories unless you absolutely have to, since you're trusting a third party with your packages, often unnecessarily if your commonly used packages are available in winget or the Microsoft Store. Also keep in mind that most apps on Windows are self-updating, or have some GUI-based update system, since most Windows users aren't going to interact with the command prompt on the daily.

=== Android

Android also has third-party repositories in the form of app stores. Some of examples of this are #link("https://f-droid.org/en/")[F-Droid] and #link("https://accrescent.app/")[Accrescent]. The #link("https://privsec.dev/posts/android/android-tips/#where-to-get-your-applications")[recommended way to install apps] on Android is through the Play Store (if you use an OS with the Play Store built-in), since they have a strict set of requirements for apps available on it. These requirements may be annoying to deal with for app developers, but they're there to keep the user safe from potential threats. One example of these requirements is the #link("https://support.google.com/googleplay/android-developer/answer/11926878")[target API level], which determines the version of Android the app is designed to run on. As the Android version goes up, so does the security level of the OS, which ends up limiting the amount of access apps have, and keeps the user of said apps better protected from the app itself, as well as any vulnerabilities it may have. As of the writing of this post, the target API level required to upload an app to the Play Store is #link("https://developer.android.com/google/play/requirements/target-sdk")[Android 12 (API level 31)].

#link("https://accrescent.app/docs/guide/publish/requirements.html")[Accrescent] follows the same target API requirements and security practicies as the Play Store, as well as adding a few #link("https://accrescent.app/features")[features] of its own. It is currently in beta, and has a limited selection of apps for the time being, but it is perfectly fine to use if you wish.

#link("https://privsec.dev/posts/android/f-droid-security-issues/")[F-Droid is a different story], however. I recommend you read the linked post about it, if you haven't already. It explains many different issues with the F-Droid security model in far better detail than I ever could.

=== macOS

There are two main third-party repositories on the macOS side of things: #link("https://brew.sh/")[Homebrew] and #link("https://www.macports.org/")[MacPorts]. While it is recommended to stick to the GUI installation methods and the Mac App Store as much as possible, certain packages are only available on one of these package managers. In situations like those, using them can be acceptable. Both Homebrew and MacPorts have their own advantages and disadvantages, and I suggest you do your research on them before using either one.

== Linux

Linux distros and package management is such a huge and ridiculous topic that it deserves its own section. There are _so_ many packaging solutions for Linux, and none of them work as well as any of the other package managers I mentioned above. Here's a list of just the main ones:

- Distribution package managers:

  - dpkg (Debian/Ubuntu)

  - RPM (Red Hat/Fedora/CentOS/OpenSUSE)

  - Pacman (Arch)

  - Portage (Gentoo)

  - eopkg (Solus)

  - APK (Alpine, different from the Android package format)

  - PiSi (Pardus)

  - Puppy Package Manager (Puppy Linux)

  - slackpkg (Slackware)

  - XBPS (Void Linux)

  - opkg (OpenWrt)

- Cross-distro package managers

  - Flatpak

  - Snap

  - Nix (default on NixOS, can be installed on most Linux distros and macOS)

  - AppImage (not a package manager exactly, more like a package format)

  - Linuxbrew (Homebrew ported over to Linux)

  - GNU Guix (default on GNU Guix System, can be installed on other distros, based on Nix)

Most people tend to use the distribution's own package managers and repositories, as they're enabled by default and built-in to the system. However, oftentimes the packages that these package managers provide are #link("https://unix.stackexchange.com/questions/196693/why-are-the-packages-in-the-official-repo-often-very-out-of-date")[out of date], and therefore may be riddled with unpatched bugs and security holes. This happens because the distro #link("https://docs.fedoraproject.org/en-US/package-maintainers/")[maintains the packages themselves], instead of letting the package developers keep it up to date. This means you are fully dependent on the maintainer for the package you want to update it quickly after the package developer releases a new version.

The distribution family that seems to suffer the most from this is the Debian/Ubuntu family, which follow a #link("https://unix.stackexchange.com/a/9346")[long-term support (LTS) release schedule]. For instance, the latest release of Node.js is at 19.6.0 at the time of writing. Debian repositories ship 12.22.5 in the latest stable release branch, while Ubuntu ships 12.22.9. The official Node.js LTS release is at 18.14.0. Considering Node.js is very commonly used in web development, I'm not sure having an outdated version is a good idea. Not only do you lose security patches, you also miss out on features that may only be available on newer versions of Node.js and npm.

On the other side of the spectrum lie the #link("https://itsfoss.com/rolling-release/")[rolling release] distros, like Arch and OpenSUSE Tumbleweed. These have much more up-to-date packages in comparison. For instance, the Node.js package on Arch is on 19.6.0, while OpenSUSE ships 19.5.0. Being a single point version behind the latest release is far less impactful than being several versions behind the LTS version, so a rolling release schedule does succeed in that regard. However, this also means that there's a #link("https://wiki.archlinux.org/title/System_maintenance")[chance of things breaking], since the updated version of the package may not have been tested on the OS it's being installed on. This chance goes up significantly if you include the AUR, which has few restrictions for packages, and is completely maintained by volunteers from the community. This means that anything could #link("https://www.bleepingcomputer.com/news/security/malware-found-in-arch-linux-aur-package-repository/")[contain bugs or malware], and without auditing the build scripts (which most people aren't going to do) there's no way to know.

Some distros, like Fedora, follow a less extreme approach to package management, with a #link("https://forums.fedoraforum.org/showthread.php?329248-Pleasantly-surprised#post_1862751")[semi-rolling release] schedule. This allows them to be relatively up to date compared to LTS, while still being behind the bleeding edge of rolling release, and helps avoid the downsides of both. For instance, the Node.js package on Fedora is at 18.12.1, which is just a few versions behind the official LTS release. However, there have been instances where Fedora has been much more out of date.

#link("https://appimage.org/")[AppImage] is a package format that is distro-agnostic, but lacks an #link("https://docs.appimage.org/packaging-guide/optional/updates.html")[updating mechanism by default], so every time you want to update the package you have to redownload the `.appimage` file for the new version, or use an external tool to update it if there isn't one built into the package. #link("https://docs.brew.sh/Homebrew-on-Linux")[Homebrew] is a good solution, but lacks Casks on Linux, which means only CLI programs are available. Nix seems to follow a similar release schedule to Fedora, while Guix is very out of date for even a popular package like Node.js, being at 14.19.3. #link("https://flatpak.org/")[Flatpak] and #link("https://snapcraft.io/")[Snap] are a step in the right direction, usually staying more up to date than their distro-specific counterparts, but ultimately they only add to the problem.

The inherent problem with package management on Linux is that every package manager wants to maintain their own packages, instead of letting the developers of the package do it like they do for every other OS. The argument of "but they wouldn't build for my distribution" arises, to which I answer, that's a direct consequence of having this many package managers and formats. No developer wants to maintain a different package for every single distro, on top of having to maintain packages for all the other OSes. However, pushing the responsibility of keeping everything up to date while still ensuring stability to volunteers maybe isn't the best solution either.

= I can make an OS that fixes all that!

#link("https://xkcd.com/927/")[Don't]. There is enough fragmentation in the world of operating systems, with everyone doing their own thing and very little agreement between them. In a world where there are thousands of Linux distributions, and more OSes if you look at others like the BSDs, yet no one can agree on whether to use #link("https://unix.stackexchange.com/questions/11544/what-is-the-difference-between-opt-and-usr-local")[`/opt/` or `/usr/local/`] to install applications, _more_ options and divison is not what's needed.

What's needed is a level of standardisation to bring everything together, and organise the community into actually building solutions that can be usable by the average person. I'm not suggesting that a closed environment like iOS or Windows is needed, those go too far in the other direction. Android strikes a good middle ground, allowing for vast customisation and user choice for those who want it, but being simple enough to use out-of-the-box, and being one of the most secure OSes in the world, as well as being stable but up to date.

= Final results

#table(
  columns: (auto, auto, auto, auto, auto),
  table.header([OS], [Simple], [Stable], [Secure], [Up to date]),
  [Windows], [✓], [~], [✓], [✓],
  [macOS], [✓], [✓], [✓], [✓],
  [Android], [✓], [✓], [✓], [✓],
  [iOS], [✓], [✓], [✓], [✓],
  [Linux#super[2]], [~], [✓], [✕], [~],
  [ChromeOS#super[3]], [✓], [✓], [✓], [✓],
)

= Footnotes

1. The indentations mean that the indented distro is based off of the parent. For instance, Ubuntu is based on Debian. This is also a very small list compared to the total number of distributions out there.

2. This doesn't target any one distribution, but instead is a representation of the Linux ecosystem as a whole. Some distros like Fedora may be more secure but not as up to date, while others like Arch are more up to date but not simple, and some like Ubuntu or Linux Mint are simple, but not up to date or secure.

3. This excludes usage of the Linux dev environment. For results for that, refer to the Linux row of the table.
