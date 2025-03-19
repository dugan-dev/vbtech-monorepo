import Image from "next/image";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  CheckCircledIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  EyeNoneIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ActivitySquare,
  AlertCircle,
  Ban,
  BarChartBig,
  Bell,
  BookHeart,
  Building,
  Building2,
  Calendar,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  Cpu,
  Diff,
  DollarSign,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileKey,
  Files,
  FileSliders,
  FileX,
  Goal,
  HeartHandshake,
  HeartPulse,
  Hotel,
  Key,
  Landmark,
  Layers,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Maximize2,
  Moon,
  MoreHorizontal,
  Network,
  Pencil,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Share,
  SquareGanttChart,
  Stethoscope,
  Store,
  Sun,
  Trash2,
  Unlock,
  User,
  UserCog,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react";

type LogoProps = Omit<React.ComponentProps<typeof Image>, "src" | "alt"> & {
  width?: number;
  height?: number;
};

export const Icons = {
  activitySquare: ActivitySquare,
  alertCircle: AlertCircle,
  arrowDown: ArrowDownIcon,
  arrowUp: ArrowUpIcon,
  ban: Ban,
  barChartBig: BarChartBig,
  bell: Bell,
  bookHeart: BookHeart,
  building: Building,
  building2: Building2,
  calendar: Calendar,
  calendarCheck: CalendarCheck,
  caretSort: CaretSortIcon,
  checkCircledIcon: CheckCircledIcon,
  check: Check,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  doubleArrowLeft: DoubleArrowLeftIcon,
  doubleArrowRight: DoubleArrowRightIcon,
  circleAlert: CircleAlert,
  clipboardCheck: ClipboardCheck,
  clipboardList: ClipboardList,
  cpu: Cpu,
  diff: Diff,
  dollarSign: DollarSign,
  download: Download,
  eye: Eye,
  eyeNone: EyeNoneIcon,
  eyeOff: EyeOff,
  edit: Edit,
  fileKey: FileKey,
  fileX: FileX,
  files: Files,
  fileSliders: FileSliders,
  goal: Goal,
  heartHandshake: HeartHandshake,
  heartPulse: HeartPulse,
  hotel: Hotel,
  key: Key,
  landmark: Landmark,
  layers: Layers,
  layoutDashboard: LayoutDashboard,
  loader: Loader2,
  lock: Lock,
  logout: LogOut,
  maximize: Maximize2,
  mixerHorizontal: MixerHorizontalIcon,
  moon: Moon,
  moreHorizontal: MoreHorizontal,
  network: Network,
  plus: Plus,
  pencil: Pencil,
  plusCircle: PlusCircle,
  trash2: Trash2,
  search: Search,
  settings: Settings,
  share: Share,
  squareGanttChart: SquareGanttChart,
  stethoscope: Stethoscope,
  store: Store,
  sun: Sun,
  unlock: Unlock,
  user: User,
  userCog: UserCog,
  users: Users,
  userPlus: UserPlus,
  wrench: Wrench,
  logo: ({ width = 250, height = 100, ...props }: LogoProps) => (
    <Image
      src="/vbpay-logo-blue.png"
      alt="VB Pay Logo"
      width={width}
      height={height}
      {...props}
    />
  ),
  logoDark: ({ width = 250, height = 100, ...props }: LogoProps) => (
    <Image
      src="/vbpay-logo.png"
      alt="VB Pay Logo"
      width={width}
      height={height}
      {...props}
    />
  ),
  nppesLogo: ({ width = 120, height = 120, ...props }: LogoProps) => (
    <Image
      src="/NPPES-logo.png"
      alt="NPPES Logo"
      width={width}
      height={height}
      {...props}
      loading="lazy"
    />
  ),
};
