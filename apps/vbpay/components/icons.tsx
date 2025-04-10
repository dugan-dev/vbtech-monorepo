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
  ChevronsUpDown,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  Cpu,
  Diff,
  DollarSign,
  Download,
  Edit,
  Ellipsis,
  Eye,
  EyeOff,
  File,
  FileKey,
  Files,
  FileSliders,
  FileX,
  Goal,
  HeartHandshake,
  HeartPulse,
  Hotel,
  IdCard,
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
  RefreshCcw,
  Search,
  Settings,
  Share,
  SquareFunction,
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
  UserX,
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
  chevronsUpDown: ChevronsUpDown,
  doubleArrowLeft: DoubleArrowLeftIcon,
  doubleArrowRight: DoubleArrowRightIcon,
  circleAlert: CircleAlert,
  clipboardCheck: ClipboardCheck,
  clipboardList: ClipboardList,
  cpu: Cpu,
  diff: Diff,
  dollarSign: DollarSign,
  download: Download,
  ellipsis: Ellipsis,
  eye: Eye,
  eyeNone: EyeNoneIcon,
  eyeOff: EyeOff,
  edit: Edit,
  file: File,
  fileKey: FileKey,
  fileX: FileX,
  files: Files,
  fileSliders: FileSliders,
  goal: Goal,
  heartHandshake: HeartHandshake,
  heartPulse: HeartPulse,
  hotel: Hotel,
  idCard: IdCard,
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
  refresh: RefreshCcw,
  search: Search,
  settings: Settings,
  share: Share,
  squareFunction: SquareFunction,
  squareGanttChart: SquareGanttChart,
  stethoscope: Stethoscope,
  store: Store,
  sun: Sun,
  unlock: Unlock,
  user: User,
  userX: UserX,
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
